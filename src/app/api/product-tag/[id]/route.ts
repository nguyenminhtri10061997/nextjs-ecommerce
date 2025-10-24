import { AppError } from "@/common/server/appError";
import { AppResponse } from "@/common/server/appResponse";
import { AppStatusCode } from "@/common/statusCode";
import { THofContext } from "@/lib/HOF/type";
import { withValidateFieldHandler } from "@/lib/HOF/withValidateField";
import { withVerifyAccessToken } from "@/lib/HOF/withVerifyAccessToken";
import { withVerifyCanDoAction } from "@/lib/HOF/withVerifyCanDoAction";
import prisma from "@/lib/prisma";
import { EPermissionAction, EPermissionResource } from "@prisma/client";
import { IdParamsDTO, PatchBodyDTO } from "./validator";

export const GET = withValidateFieldHandler(
  IdParamsDTO,
  null,
  null,
  withVerifyAccessToken(
    withVerifyCanDoAction(
      {
        resource: EPermissionResource.PRODUCT_STATUS,
        action: EPermissionAction.READ,
      },
      async (_, ctx: THofContext<typeof IdParamsDTO>) => {
        const entity = await prisma.productTag.findUnique({
          where: { id: ctx.paramParse!.id },
        });

        if (!entity) {
          return AppError.json({
            status: 404,
            message: "Product tag not found",
          });
        }

        return AppResponse.json({ status: 200, data: entity });
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
        resource: EPermissionResource.PRODUCT_STATUS,
        action: EPermissionAction.UPDATE,
      },
      async (
        _,
        ctx: THofContext<typeof IdParamsDTO, never, typeof PatchBodyDTO>
      ) => {
        const { id } = ctx.paramParse!;
        const {
          code,
          name,
          slug,
          description,
          expiredAfterDays,
          displayType,
          image,
          bgColor,
          textColor,
          displayOrder,
          isActive,
        } = ctx.bodyParse!;

        const entity = await prisma.productTag.findUnique({ where: { id } });
        if (!entity) {
          return AppError.json({
            status: AppStatusCode.NOT_FOUND,
            message: "Product tag not found",
          });
        }

        if (code || name || slug) {
          const existed = await prisma.productTag.findFirst({
            where: {
              id: { not: id },
              OR: [{ name }, { slug }, { code }],
            },
          });

          if (existed) {
            let mes = "Code";
            if (existed.name === name) {
              mes = "Name";
            } else if (existed.slug === slug) {
              mes = "Slug";
            }
            return AppError.json({
              status: AppStatusCode.EXISTING,
              message: `${mes} already exist`,
            });
          }
        }

        const updated = await prisma.productTag.update({
          where: { id },
          data: {
            code,
            name,
            slug,
            description,
            expiredAfterDays,
            displayType,
            image,
            bgColor,
            textColor,
            displayOrder,
            isActive,
          },
        });

        return AppResponse.json({ status: 200, data: updated });
      }
    )
  )
);
