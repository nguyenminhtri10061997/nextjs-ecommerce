import { AppResponse } from "@/common/server/appResponse";
import { AppError } from "@/common/server/appError";
import { AppStatusCode } from "@/constants/statusCode";
import prisma from "@/constants/prisma";
import { withValidateFieldHandler } from "@/constants/HOF/withValidateField";
import { withVerifyAccessToken } from "@/constants/HOF/withVerifyAccessToken";
import { withVerifyCanDoAction } from "@/constants/HOF/withVerifyCanDoAction";
import { THofContext } from "@/constants/HOF/type";
import { EPermissionAction, EPermissionResource } from "@prisma/client";
import { IdParamsDTO, PatchBodyDTO } from "./validator";

export const GET = withValidateFieldHandler(
  IdParamsDTO,
  null,
  null,
  withVerifyAccessToken(
    withVerifyCanDoAction(
      {
        resource: EPermissionResource.PRODUCT_CATEGORY,
        action: EPermissionAction.READ,
      },
      async (_, ctx: THofContext<typeof IdParamsDTO>) => {
        const data = await prisma.productCategory.findUnique({
          where: { id: ctx.paramParse!.id },
        });

        if (!data) {
          return AppError.json({
            status: 404,
            message: "Product category not found",
          });
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
        resource: EPermissionResource.PRODUCT_CATEGORY,
        action: EPermissionAction.UPDATE,
      },
      async (
        _,
        ctx: THofContext<typeof IdParamsDTO, never, typeof PatchBodyDTO>
      ) => {
        const { id } = ctx.paramParse!;
        const {
          name,
          slug,
          seoTitle,
          description,
          seoDescription,
          displayOrder,
          productCategoryParentId,
          isActive,
        } = ctx.bodyParse!;

        const existing = await prisma.productCategory.findUnique({
          where: { id },
        });
        if (!existing) {
          return AppError.json({
            status: AppStatusCode.NOT_FOUND,
            message: "Product category not found",
          });
        }

        if (name || slug) {
          const exists = await prisma.productCategory.findFirst({
            where: {
              id: {
                not: existing.id,
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

        const updated = await prisma.productCategory.update({
          where: { id },
          data: {
            name,
            slug,
            seoTitle,
            description,
            seoDescription,
            displayOrder,
            productCategoryParentId,
            isActive,
          },
        });

        return AppResponse.json({ status: 200, data: updated });
      }
    )
  )
);
