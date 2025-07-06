import { getOrderBy, getSkipAndTake } from "@/common";
import { AppError } from "@/common/appError";
import { AppResponse } from "@/common/appResponse";
import { AppStatusCode } from "@/common/statusCode";
import { THofContext } from "@/lib/HOF/type";
import { withValidateFieldHandler } from "@/lib/HOF/withValidateField";
import { withVerifyAccessToken } from "@/lib/HOF/withVerifyAccessToken";
import { withVerifyCanDoAction } from "@/lib/HOF/withVerifyCanDoAction";
import prisma from "@/lib/prisma";
import { TGetProductRatingListResponse } from "@/types/api/product-rating";
import { EPermissionAction, EPermissionResource, Prisma } from "@prisma/client";
import dayjs from "dayjs";
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
        const { orderQuery, pagination, dateRangeQuery, ratings, } = ctx.queryParse || {};
        const where: Prisma.ProductRatingWhereInput = {};

        if (dateRangeQuery?.startDate && dateRangeQuery?.endDate) {
          where["createdAt"] = {
            gte: dayjs(dateRangeQuery.startDate).startOf("d").toDate(),
            lte: dayjs(dateRangeQuery.endDate).startOf("d").toDate(),
          };
        }

        const {
          skip,
          take,
        } = getSkipAndTake(pagination)

        const findManyArgs: Prisma.ProductRatingFindManyArgs = {
          where,
          skip,
          take,
          orderBy: getOrderBy(orderQuery),
        };

        if (ratings?.length) {
          where.rating = {
            in: ratings
          }
        }

        const [data, count] = await Promise.all([
          prisma.productRating.findMany(findManyArgs),
          skip && take ? prisma.productRating.count({ where }) : undefined,
        ]);

        return AppResponse.json({
          status: 200,
          data: {
            data,
            pagination: pagination ? {
              ...pagination,
              count,
            } : undefined,
          } as TGetProductRatingListResponse,
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
            status: AppStatusCode.EXISTING,
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
