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
import {
  DeleteBodyDTO,
  GetQueryDTO,
  PostCreateBodyDTO,
} from "./validator";

export const GET = withValidateFieldHandler(
  null,
  GetQueryDTO,
  null,
  withVerifyAccessToken(
    withVerifyCanDoAction(
      { resource: EPermissionResource.PRODUCT_RATING, action: EPermissionAction.READ },
      async (_, ctx: THofContext<never, typeof GetQueryDTO>) => {
        const { orderQuery, searchQuery } = ctx.queryParse || {};
        const where: Prisma.ProductRatingWhereInput = {};

        if (searchQuery?.searchKey && searchQuery?.searchStr) {
          const key = searchQuery.searchKey as keyof Prisma.ProductRatingWhereInput;
          where[key] = {
            [searchQuery.searchType || ESearchType.contains]: searchQuery.searchStr,
          } as any;
        }

        const data = await prisma.productRating.findMany({
          where,
          orderBy: getOrderBy(orderQuery),
          include: {
            user: true,
            product: true,
          },
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
      { resource: EPermissionResource.PRODUCT_RATING, action: EPermissionAction.CREATE },
      async (_, ctx: THofContext<never, never, typeof PostCreateBodyDTO>) => {
        const {
          userId,
          productId,
          rating,
          title,
          detail,
          video,
          images,
        } = ctx.bodyParse!;

        const exists = await prisma.productRating.findFirst({
          where: { userId, productId },
        });

        if (exists) {
          return AppError.json({
            status: 409,
            message: "You have already rated this product",
          });
        }

        const res = await prisma.productRating.create({
          data: {
            userId,
            productId,
            rating,
            title,
            detail,
            video,
            images,
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
      { resource: EPermissionResource.PRODUCT_RATING, action: EPermissionAction.DELETE },
      async (_, ctx: THofContext<never, never, typeof DeleteBodyDTO>) => {
        const res = await prisma.productRating.deleteMany({
          where: { id: { in: ctx.bodyParse!.ids } },
        });

        return AppResponse.json({ status: 200, data: res.count });
      }
    )
  )
);
