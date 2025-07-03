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
      { resource: EPermissionResource.PRODUCT_STATUS, action: EPermissionAction.READ },
      async (_, ctx: THofContext<never, typeof GetQueryDTO>) => {
        const { orderQuery, searchQuery } = ctx.queryParse || {};
        const where: Prisma.ProductStatusWhereInput = {};

        if (searchQuery?.searchKey && searchQuery?.searchStr) {
          const key = searchQuery.searchKey as keyof Prisma.ProductStatusWhereInput;
          where[key] = {
            [searchQuery.searchType || ESearchType.equals]: searchQuery.searchStr,
          } as any;
        }

        const data = await prisma.productStatus.findMany({
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
      { resource: EPermissionResource.PRODUCT_STATUS, action: EPermissionAction.CREATE },
      async (_, ctx: THofContext<never, never, typeof PostCreateBodyDTO>) => {
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

        const exists = await prisma.productStatus.findFirst({
          where: { OR: [{ name }, { slug }] },
        });

        if (exists) {
          return AppError.json({ status: 409, message: "Name or slug already exists" });
        }

        const created = await prisma.productStatus.create({
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
      { resource: EPermissionResource.PRODUCT_STATUS, action: EPermissionAction.DELETE },
      async (_, ctx: THofContext<never, never, typeof DeleteBodyDTO>) => {
        const res = await prisma.productStatus.deleteMany({
          where: { id: { in: ctx.bodyParse!.ids } },
        });
        return AppResponse.json({ status: 200, data: res.count });
      }
    )
  )
);
