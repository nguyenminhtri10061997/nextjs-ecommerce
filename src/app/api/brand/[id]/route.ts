import { AppError } from "@/common/server/appError";
import { AppResponse } from "@/common/server/appResponse";
import { THofContext } from "@/constants/HOF/type";
import { withValidateFieldHandler } from "@/constants/HOF/withValidateField";
import { withVerifyAccessToken } from "@/constants/HOF/withVerifyAccessToken";
import { withVerifyCanDoAction } from "@/constants/HOF/withVerifyCanDoAction";
import prisma from "@/constants/prisma";
import { AppStatusCode } from "@/constants/statusCode";
import AppS3Client from "@/lib/s3";
import { EPermissionAction, EPermissionResource } from "@prisma/client";
import { IdParamsDTO, PatchBodyDTO } from "./validator";

export const GET = withValidateFieldHandler(
  IdParamsDTO,
  null,
  null,
  withVerifyAccessToken(
    withVerifyCanDoAction(
      { resource: EPermissionResource.BRAND, action: EPermissionAction.READ },
      async (_, ctx: THofContext<typeof IdParamsDTO>) => {
        const brand = await prisma.brand.findUnique({
          where: { id: ctx.paramParse!.id },
        });

        if (!brand) {
          return AppError.json({
            status: AppStatusCode.NOT_FOUND,
            message: "Brand not found",
          });
        }

        return AppResponse.json({
          status: 200,
          data: brand,
        });
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
      { resource: EPermissionResource.BRAND, action: EPermissionAction.UPDATE },
      async (
        _,
        ctx: THofContext<typeof IdParamsDTO, never, typeof PatchBodyDTO>
      ) => {
        const { id } = ctx.paramParse!;
        const { name, slug, logoImgFile, isActive } = ctx.bodyParse!;

        const brand = await prisma.brand.findUnique({ where: { id } });
        if (!brand) {
          return AppError.json({
            status: AppStatusCode.NOT_FOUND,
            message: "Brand not found",
          });
        }

        if (name || slug) {
          const exists = await prisma.brand.findFirst({
            where: {
              id: {
                not: brand.id,
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

        let logoImage;
        if (logoImgFile !== undefined) {
          if (logoImgFile !== null) {
            logoImage = await AppS3Client.s3CreateFile(logoImgFile);
          } else {
            logoImage = null;
          }
          if (brand.logoImage) {
            await AppS3Client.s3DeleteFile(brand.logoImage);
          }
        }

        const updated = await prisma.brand.update({
          where: { id },
          data: {
            name,
            slug,
            logoImage,
            isActive,
          },
        });

        return AppResponse.json({ status: 200, data: updated });
      }
    )
  )
);
