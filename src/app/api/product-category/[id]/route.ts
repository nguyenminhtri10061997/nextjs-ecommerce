import { AppResponse } from "@/common/appResponse";
import { AppError } from "@/common/appError";
import { AppStatusCode } from "@/common/statusCode";
import prisma from "@/lib/prisma";
import { withValidateFieldHandler } from "@/lib/HOF/withValidateField";
import { withVerifyAccessToken } from "@/lib/HOF/withVerifyAccessToken";
import { withVerifyCanDoAction } from "@/lib/HOF/withVerifyCanDoAction";
import { THofContext } from "@/lib/HOF/type";
import { EPermissionAction, EPermissionResource } from "@prisma/client";
import { IdParamsDTO, PutBodyDTO } from "./validator";

export const GET = withValidateFieldHandler(
  IdParamsDTO,
  null,
  null,
  withVerifyAccessToken(
    withVerifyCanDoAction(
      { resource: EPermissionResource.PRODUCT_CATEGORY, action: EPermissionAction.READ },
      async (_, ctx: THofContext<typeof IdParamsDTO>) => {
        const data = await prisma.productCategory.findUnique({
          where: { id: ctx.paramParse!.id },
        });

        if (!data) {
          return AppError.json({ status: 404, message: "Product category not found" });
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
      { resource: EPermissionResource.PRODUCT_CATEGORY, action: EPermissionAction.UPDATE },
      async (_, ctx: THofContext<typeof IdParamsDTO, never, typeof PutBodyDTO>) => {
        const { id } = ctx.paramParse!;
        const {
          name,
          seoTitle,
          description,
          seoDescription,
          displayOrder,
          productCategoryParentId,
          isActive,
        } = ctx.bodyParse!;

        const existing = await prisma.productCategory.findUnique({ where: { id } });
        if (!existing) {
          return AppError.json({ status: AppStatusCode.NOT_FOUND, message: "Product category not found" });
        }

        const updated = await prisma.productCategory.update({
          where: { id },
          data: {
            name,
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
