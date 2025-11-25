import { AppResponse } from "@/common/server/appResponse";
import { AppError } from "@/common/server/appError";
import { getOrderBy } from "@/common/server";
import prisma from "@/lib/prisma";
import { withValidateFieldHandler } from "@/app/api/_lib/HOF/withValidateField";
import { withVerifyAccessToken } from "@/app/api/_lib/HOF/withVerifyAccessToken";
import { withVerifyCanDoAction } from "@/app/api/_lib/HOF/withVerifyCanDoAction";
import { THofContext } from "@/app/api/_lib/HOF/type";
import { EPermissionResource, EPermissionAction, Prisma } from "@prisma/client";
import { DeleteBodyDTO, GetQueryDTO, PostCreateBodyDTO } from "./validator";
import { ESearchType } from "@/lib/zod/paginationDTO";
import { AppStatusCode } from "@/common/server/statusCode";

export const GET = withValidateFieldHandler(
  null,
  GetQueryDTO,
  null,
  withVerifyAccessToken(
    withVerifyCanDoAction(
      {
        resource: EPermissionResource.PRODUCT_CATEGORY,
        action: EPermissionAction.READ,
      },
      async (_, ctx: THofContext<never, typeof GetQueryDTO>) => {
        const { orderQuery, searchQuery } = ctx.queryParse || {};
        const where: Prisma.ProductCategoryWhereInput = {};

        if (searchQuery?.searchKey && searchQuery?.searchStr) {
          const key =
            searchQuery.searchKey as keyof Prisma.ProductCategoryWhereInput;
          where[key] = {
            [searchQuery.searchType || ESearchType.contains]:
              searchQuery.searchStr,
          } as never;
        }

        const data = await prisma.productCategory.findMany({
          where,
          orderBy: getOrderBy(orderQuery),
        });

        return AppResponse.json({ status: 200, data });
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
      {
        resource: EPermissionResource.PRODUCT_CATEGORY,
        action: EPermissionAction.CREATE,
      },
      async (_, ctx: THofContext<never, never, typeof PostCreateBodyDTO>) => {
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

        const exists = await prisma.productCategory.findFirst({
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

        const res = await prisma.productCategory.create({
          data: {
            name,
            slug,
            seoTitle,
            description,
            seoDescription,
            displayOrder,
            productCategoryParentId,
            isActive: isActive || false,
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
      {
        resource: EPermissionResource.PRODUCT_CATEGORY,
        action: EPermissionAction.DELETE,
      },
      async (_, ctx: THofContext<never, never, typeof DeleteBodyDTO>) => {
        const res = await prisma.productCategory.deleteMany({
          where: { id: { in: ctx.bodyParse!.ids } },
        });
        return AppResponse.json({ status: 200, data: res.count });
      }
    )
  )
);
