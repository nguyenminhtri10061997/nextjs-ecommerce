import { AppError } from "@/common/appError";
import { AppResponse } from "@/common/appResponse";
import { AppStatusCode } from "@/common/statusCode";
import { THofContext } from "@/lib/HOF/type";
import { withValidateFieldHandler } from "@/lib/HOF/withValidateField";
import { withVerifyAccessToken } from "@/lib/HOF/withVerifyAccessToken";
import { withVerifyCanDoAction } from "@/lib/HOF/withVerifyCanDoAction";
import prisma from "@/lib/prisma";
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

        return AppResponse.json({ status: 200, data: brand });
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
        const { name, slug, logoImage, isActive } = ctx.bodyParse!;

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

        if (brand.logoImage && (!logoImage || brand.logoImage !== logoImage)) {
          await AppS3Client.s3DeleteFile(brand.logoImage);
        }

        let finalLogoImg = brand.logoImage;
        if (logoImage && logoImage !== brand.logoImage) {
          finalLogoImg = await AppS3Client.moveFromTempToFinalS3File(logoImage);
        }

        const updated = await prisma.brand.update({
          where: { id },
          data: {
            name,
            slug,
            logoImage: finalLogoImg,
            isActive,
          },
        });

        return AppResponse.json({ status: 200, data: updated });
      }
    )
  )
);
