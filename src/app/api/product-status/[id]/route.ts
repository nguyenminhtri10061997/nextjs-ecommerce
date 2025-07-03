import { AppError } from "@/common/appError";
import { AppResponse } from "@/common/appResponse";
import { AppStatusCode } from "@/common/statusCode";
import { THofContext } from "@/lib/HOF/type";
import { withValidateFieldHandler } from "@/lib/HOF/withValidateField";
import { withVerifyAccessToken } from "@/lib/HOF/withVerifyAccessToken";
import { withVerifyCanDoAction } from "@/lib/HOF/withVerifyCanDoAction";
import prisma from "@/lib/prisma";
import { EPermissionAction, EPermissionResource } from "@prisma/client";
import { IdParamsDTO, PutBodyDTO } from "./validator";

export const GET = withValidateFieldHandler(
  IdParamsDTO,
  null,
  null,
  withVerifyAccessToken(
    withVerifyCanDoAction(
      { resource: EPermissionResource.PRODUCT_STATUS, action: EPermissionAction.READ },
      async (_, ctx: THofContext<typeof IdParamsDTO>) => {
        const entity = await prisma.productStatus.findUnique({
          where: { id: ctx.paramParse!.id },
        });

        if (!entity) {
          return AppError.json({ status: 404, message: "Product status not found" });
        }

        return AppResponse.json({ status: 200, data: entity });
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
      { resource: EPermissionResource.PRODUCT_STATUS, action: EPermissionAction.UPDATE },
      async (_, ctx: THofContext<typeof IdParamsDTO, never, typeof PutBodyDTO>) => {
        const { id } = ctx.paramParse!;
        const {
          name,
          slug,
          description,
          expiredAfterDays,
          image,
          backgroundColor,
          displayOrder,
          isActive,
        } = ctx.bodyParse!;

        const entity = await prisma.productStatus.findUnique({ where: { id } });
        if (!entity) {
          return AppError.json({ status: AppStatusCode.NOT_FOUND, message: "Product status not found" });
        }

        const existed = await prisma.productStatus.findFirst({
          where: {
            id: { not: id },
            OR: [{ name }, { slug }],
          },
        });

        if (existed) {
          return AppError.json({
            status: AppStatusCode.EXISTING,
            message: "Another status with same name or slug already exists",
          });
        }

        const updated = await prisma.productStatus.update({
          where: { id },
          data: {
            name,
            slug,
            description,
            expiredAfterDays,
            image,
            backgroundColor,
            displayOrder,
            isActive,
          },
        });

        return AppResponse.json({ status: 200, data: updated });
      }
    )
  )
);
