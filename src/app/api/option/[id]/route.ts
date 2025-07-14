import { AppResponse } from "@/common/appResponse";
import { AppError } from "@/common/appError";
import { AppStatusCode } from "@/common/statusCode";
import prisma from "@/lib/prisma";
import { THofContext } from "@/lib/HOF/type";
import { withValidateFieldHandler } from "@/lib/HOF/withValidateField";
import { withVerifyAccessToken } from "@/lib/HOF/withVerifyAccessToken";
import { withVerifyCanDoAction } from "@/lib/HOF/withVerifyCanDoAction";
import { EPermissionAction, EPermissionResource, Prisma } from "@prisma/client";
import { IdParamsDTO, PatchBodyDTO } from "./validator";

export const GET = withValidateFieldHandler(
  IdParamsDTO,
  null,
  null,
  withVerifyAccessToken(
    withVerifyCanDoAction(
      {
        resource: EPermissionResource.ATTRIBUTE,
        action: EPermissionAction.READ,
      },
      async (_, ctx: THofContext<typeof IdParamsDTO>) => {
        const data = await prisma.option.findUnique({
          where: { id: ctx.paramParse!.id },
          include: {
            optionItems: {
              orderBy: {
                displayOrder: "asc",
              },
            },
          },
        });

        if (!data) {
          return AppError.json({ status: 404, message: "Option not found" });
        }

        return AppResponse.json({ status: 200, data });
      }
    )
  )
);

export const PATCH = withValidateFieldHandler(
  IdParamsDTO,
  null,
  PatchBodyDTO,
  withVerifyAccessToken(
    withVerifyCanDoAction(
      {
        resource: EPermissionResource.ATTRIBUTE,
        action: EPermissionAction.UPDATE,
      },
      async (
        _,
        ctx: THofContext<typeof IdParamsDTO, never, typeof PatchBodyDTO>
      ) => {
        const { id } = ctx.paramParse!;
        const { name, slug, optionItems } = ctx.bodyParse!;

        const existing = await prisma.option.findUnique({
          where: { id },
          include: { optionItems: true },
        });
        if (!existing) {
          return AppError.json({
            status: AppStatusCode.NOT_FOUND,
            message: "Option not found",
          });
        }

        if (name || slug) {
          const exists = await prisma.option.findFirst({
            where: {
              id: {
                not: id,
              },
              OR: [
                {
                  name,
                },
                {
                  slug,
                },
              ],
            },
          });
          if (exists) {
            if (exists.name === name) {
              return AppError.json({
                status: AppStatusCode.EXISTING,
                message: "Name already exist",
              });
            }
            if (exists.slug === slug) {
              return AppError.json({
                status: AppStatusCode.EXISTING,
                message: "Slug already exist",
              });
            }
          }
        }

        const objUpdate: Prisma.OptionUpdateInput = {
          name,
          slug,
        };

        if (optionItems) {
          const existingIds = new Set(
            existing.optionItems.map((v) => v.id)
          );
          const incomingIds = new Set(
            optionItems.map((v) => v.id).filter(Boolean)
          );

          const toDelete = Array.from(existingIds).filter(
            (id) => !incomingIds.has(id!)
          );
          const toUpdate = optionItems.filter((v) => v.id);
          const toCreate = optionItems.filter((v) => !v.id);

          objUpdate.optionItems = {
            deleteMany: { id: { in: toDelete } },
            updateMany: toUpdate.map((v) => ({
              where: { id: v.id },
              data: {
                name: v.name,
                slug: v.slug,
                displayOrder: v.displayOrder,
              },
            })),
            create: toCreate.map((v) => ({
              name: v.name,
              slug: v.slug,
              displayOrder: v.displayOrder,
            })),
          };
        }

        const updated = await prisma.option.update({
          where: { id },
          data: objUpdate,
        });

        return AppResponse.json({ status: 200, data: updated });
      }
    )
  )
);
