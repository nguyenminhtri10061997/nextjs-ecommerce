import { AppResponse } from "@/common/appResponse";
import { AppError } from "@/common/appError";
import { AppStatusCode } from "@/common/statusCode";
import prisma from "@/lib/prisma";
import { THofContext } from "@/lib/HOF/type";
import { withValidateFieldHandler } from "@/lib/HOF/withValidateField";
import { withVerifyAccessToken } from "@/lib/HOF/withVerifyAccessToken";
import { withVerifyCanDoAction } from "@/lib/HOF/withVerifyCanDoAction";
import { EPermissionAction, EPermissionResource } from "@prisma/client";
import { IdParamsDTO, PutBodyDTO } from "./validator";

export const GET = withValidateFieldHandler(
  IdParamsDTO,
  null,
  null,
  withVerifyAccessToken(
    withVerifyCanDoAction(
      { resource: EPermissionResource.ATTRIBUTE, action: EPermissionAction.READ },
      async (_, ctx: THofContext<typeof IdParamsDTO>) => {
        const data = await prisma.attribute.findUnique({
          where: { id: ctx.paramParse!.id },
          include: { attributeValues: true },
        });

        if (!data) {
          return AppError.json({ status: 404, message: "Attribute not found" });
        }

        return AppResponse.json({ status: 200, data });
      }
    )
  )
);

export const PUT = withValidateFieldHandler(
  IdParamsDTO,
  null,
  PutBodyDTO,
  withVerifyAccessToken(
    withVerifyCanDoAction(
      { resource: EPermissionResource.ATTRIBUTE, action: EPermissionAction.UPDATE },
      async (_, ctx: THofContext<typeof IdParamsDTO, never, typeof PutBodyDTO>) => {
        const { id } = ctx.paramParse!;
        const { name, type, attributeValues } = ctx.bodyParse!;

        const existing = await prisma.attribute.findUnique({ where: { id }, include: { attributeValues: true } });
        if (!existing) {
          return AppError.json({ status: AppStatusCode.NOT_FOUND, message: "Attribute not found" });
        }

        const existingIds = new Set(existing.attributeValues.map((v) => v.id));
        const incomingIds = new Set(attributeValues.map((v) => v.id).filter(Boolean));

        const toDelete = Array.from(existingIds).filter((id) => !incomingIds.has(id!));
        const toUpdate = attributeValues.filter((v) => v.id);
        const toCreate = attributeValues.filter((v) => !v.id);

        const updated = await prisma.attribute.update({
          where: { id },
          data: {
            name,
            type,
            attributeValues: {
              deleteMany: { id: { in: toDelete } },
              updateMany: toUpdate.map((v) => ({
                where: { id: v.id },
                data: { name: v.name },
              })),
              create: toCreate.map((v) => ({ name: v.name })),
            },
          },
          include: { attributeValues: true },
        });

        return AppResponse.json({ status: 200, data: updated });
      }
    )
  )
);
