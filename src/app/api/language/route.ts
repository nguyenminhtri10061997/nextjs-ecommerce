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
import { AppStatusCode } from "@/common/statusCode";

export const GET = withValidateFieldHandler(
  null,
  GetQueryDTO,
  null,
  withVerifyAccessToken(
    withVerifyCanDoAction(
      { resource: EPermissionResource.LANGUAGE, action: EPermissionAction.READ },
      async (_, ctx: THofContext<never, typeof GetQueryDTO>) => {
        const { orderQuery, searchQuery } = ctx.queryParse || {};
        const where: Prisma.LanguageWhereInput = {};

        if (searchQuery?.searchKey && searchQuery?.searchStr) {
          const key = searchQuery.searchKey as keyof Prisma.LanguageWhereInput;
          where[key] = {
            [searchQuery.searchType || ESearchType.equals]: searchQuery.searchStr,
          } as any;
        }

        const [data] = await Promise.all([
          prisma.language.findMany({ where, orderBy: getOrderBy(orderQuery) }),
        ]);

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
      { resource: EPermissionResource.LANGUAGE, action: EPermissionAction.CREATE },
      async (_, ctx: THofContext<never, never, typeof PostCreateBodyDTO>) => {
        const { name, code, isActive, isDefault, } = ctx.bodyParse!;

        const exists = await prisma.language.findUnique({ where: { code } });
        if (exists) {
          return AppError.json({ status: AppStatusCode.EXISTING, message: "Language code already exists" });
        }

        if (isDefault) {
          await prisma.language.updateMany({
            where: {
              isDefault: true,
            },
            data: {
              isDefault: false,
            }
          })
        }

        const res = await prisma.language.create({
          data: { name, code, isActive, },
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
      { resource: EPermissionResource.LANGUAGE, action: EPermissionAction.DELETE },
      async (_, ctx: THofContext<never, never, typeof DeleteBodyDTO>) => {
        const res = await prisma.language.deleteMany({
          where: { id: { in: ctx.bodyParse!.ids } },
        });
        return AppResponse.json({ status: 200, data: res.count });
      }
    )
  )
);
