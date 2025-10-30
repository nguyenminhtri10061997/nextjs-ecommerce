import { getOrderBy } from "@/common/server";
import { AppError } from "@/common/server/appError";
import { AppResponse } from "@/common/server/appResponse";
import { AppStatusCode } from "@/common/server/statusCode";
import { THofContext } from "@/app/api/_lib/HOF/type";
import { withValidateFieldHandler } from "@/app/api/_lib/HOF/withValidateField";
import { withVerifyAccessToken } from "@/app/api/_lib/HOF/withVerifyAccessToken";
import { withVerifyCanDoAction } from "@/app/api/_lib/HOF/withVerifyCanDoAction";
import prisma from "@/lib/prisma";
import AppS3Client from "@/lib/s3";
import { ESearchType } from "@/lib/zod/paginationDTO";
import { EPermissionAction, EPermissionResource, Prisma } from "@prisma/client";
import { DeleteBodyDTO, GetQueryDTO, PostCreateBodyDTO } from "./validator";

export const GET = withValidateFieldHandler(
  null,
  GetQueryDTO,
  null,
  withVerifyAccessToken(
    withVerifyCanDoAction(
      { resource: EPermissionResource.BRAND, action: EPermissionAction.READ },
      async (_, ctx: THofContext<never, typeof GetQueryDTO>) => {
        const { orderQuery, searchQuery } = ctx.queryParse || {};
        const where: Prisma.BrandWhereInput = {};

        if (searchQuery?.searchKey && searchQuery?.searchStr) {
          const key = searchQuery.searchKey as keyof Prisma.BrandWhereInput;
          where[key] = {
            [searchQuery.searchType || ESearchType.equals]:
              searchQuery.searchStr,
          } as never;
        }

        const [data] = await Promise.all([
          prisma.brand.findMany({ where, orderBy: getOrderBy(orderQuery) }),
        ]);

        return AppResponse.json({
          status: 200,
          data: data,
        });
      }
    )
  )
);

export const POST = withValidateFieldHandler(
  null,
  null,
  PostCreateBodyDTO,
  withVerifyAccessToken(
    withVerifyCanDoAction(
      { resource: EPermissionResource.BRAND, action: EPermissionAction.CREATE },
      async (_, ctx: THofContext<never, never, typeof PostCreateBodyDTO>) => {
        const { name, slug, logoImage, isActive } = ctx.bodyParse!;

        const exists = await prisma.brand.findFirst({
          where: {
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

        let localImageFinal;
        if (logoImage) {
          localImageFinal = await AppS3Client.moveFromTempToFinalS3File(
            logoImage
          );
        }

        const res = await prisma.brand.create({
          data: {
            isActive,
            name,
            slug,
            logoImage: localImageFinal,
          },
        });
        return AppResponse.json({ status: 200, data: res });
      }
    )
  )
);

export const DELETE = withValidateFieldHandler(
  null,
  null,
  DeleteBodyDTO,
  withVerifyAccessToken(
    withVerifyCanDoAction(
      { resource: EPermissionResource.BRAND, action: EPermissionAction.DELETE },
      async (_, ctx: THofContext<never, never, typeof DeleteBodyDTO>) => {
        const { ids } = ctx.bodyParse!;
        const exists = await prisma.brand.findMany({
          where: {
            id: {
              in: ids,
            },
          },
        });
        const urls = exists
          .map((i) => i.logoImage)
          .filter((url) => url !== null);
        if (urls.length) {
          await AppS3Client.s3DeleteFiles(
            exists.map((i) => i.logoImage).filter((url) => url !== null)
          );
        }
        const res = await prisma.brand.deleteMany({
          where: { id: { in: ctx.bodyParse!.ids } },
        });
        return AppResponse.json({ status: 200, data: res.count });
      }
    )
  )
);
