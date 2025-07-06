import { getOrderBy } from "@/common";
import { AppError } from "@/common/appError";
import { AppResponse } from "@/common/appResponse";
import { THofContext } from "@/lib/HOF/type";
import { withValidateFieldHandler } from "@/lib/HOF/withValidateField";
import { withVerifyAccessToken } from "@/lib/HOF/withVerifyAccessToken";
import { withVerifyCanDoAction } from "@/lib/HOF/withVerifyCanDoAction";
import prisma from "@/lib/prisma";
import { ESearchType } from "@/lib/zod/paginationDTO";
import { EPermissionAction, EPermissionResource, Prisma } from "@prisma/client";
import { DeleteBodyDTO, GetQueryDTO, PostCreateBodyDTO } from "./validator";
import { AppStatusCode } from "@/common/statusCode";

export const GET = withValidateFieldHandler(
  null,
  GetQueryDTO,
  null,
  withVerifyAccessToken(
    withVerifyCanDoAction(
      {
        resource: EPermissionResource.PRODUCT_STATUS,
        action: EPermissionAction.READ,
      },
      async (_, ctx: THofContext<never, typeof GetQueryDTO>) => {
        const { orderQuery, searchQuery } = ctx.queryParse || {};
        const where: Prisma.ProductTagWhereInput = {};

        if (searchQuery?.searchKey && searchQuery?.searchStr) {
          const key =
            searchQuery.searchKey as keyof Prisma.ProductTagWhereInput;
          where[key] = {
            [searchQuery.searchType || ESearchType.equals]:
              searchQuery.searchStr,
          } as never;
        }

        const data = await prisma.productTag.findMany({
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
        resource: EPermissionResource.PRODUCT_STATUS,
        action: EPermissionAction.CREATE,
      },
      async (_, ctx: THofContext<never, never, typeof PostCreateBodyDTO>) => {
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

        const exists = await prisma.productTag.findFirst({
          where: {
            OR: [
              {
                code,
              },
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
          let mes = "Code";
          if (exists.code === name) {
            mes = "Name";
          } else if (exists.name === slug) {
            mes = "Slug";
          }
          return AppError.json({
            status: AppStatusCode.EXISTING,
            message: `${mes} already exist`,
          });
        }

        const created = await prisma.productTag.create({
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

        return AppResponse.json({ status: 200, data: created });
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
        resource: EPermissionResource.PRODUCT_STATUS,
        action: EPermissionAction.DELETE,
      },
      async (_, ctx: THofContext<never, never, typeof DeleteBodyDTO>) => {
        const res = await prisma.productTag.deleteMany({
          where: { id: { in: ctx.bodyParse!.ids } },
        });
        return AppResponse.json({ status: 200, data: res.count });
      }
    )
  )
);
