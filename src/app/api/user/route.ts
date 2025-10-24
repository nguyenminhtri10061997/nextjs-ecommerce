import { AppError } from "@/common/server/appError";
import { AppResponse } from "@/common/server/appResponse";
import { THofContext } from "@/lib/HOF/type";
import { withValidateFieldHandler } from "@/lib/HOF/withValidateField";
import { withVerifyAccessToken } from "@/lib/HOF/withVerifyAccessToken";
import { withVerifyCanDoAction } from "@/lib/HOF/withVerifyCanDoAction";
import prisma from "@/lib/prisma";
import { TGetUserListResponse } from "@/types/api/user";
import { EPermissionAction, EPermissionResource, Prisma } from "@prisma/client";
import { NextRequest } from "next/server";
import {
  GetUserQueryDTO,
  DeleteUserBodyDTO,
  PostUserCreateBodyDTO,
} from "./validator";
import { AuthService } from "@/lib/auth/authService";
import { ESearchType } from "@/lib/zod/paginationDTO";
import dayjs from "dayjs";

export const GET = withValidateFieldHandler(
  null,
  GetUserQueryDTO,
  null,
  withVerifyAccessToken(
    withVerifyCanDoAction(
      {
        resource: EPermissionResource.USER,
        action: EPermissionAction.READ,
      },
      async (_, ctx: THofContext<never, typeof GetUserQueryDTO>) => {
        const { searchQuery, dateRangeQuery } = ctx.queryParse!;
        const where: Prisma.UserWhereInput = {};

        if (searchQuery?.searchKey && searchQuery?.searchStr) {
          const key = searchQuery.searchKey as keyof Prisma.UserWhereInput;
          where[key] = {
            [searchQuery.searchType || ESearchType.equals]:
              searchQuery.searchStr,
          } as never;
        }

        if (dateRangeQuery?.startDate && dateRangeQuery?.endDate) {
          where["createdAt"] = {
            gte: dayjs(dateRangeQuery.startDate).startOf("d").toDate(),
            lte: dayjs(dateRangeQuery.endDate).startOf("d").toDate(),
          };
        }

        const findManyArgs: Prisma.UserFindManyArgs = {
          where,
          skip:
            ctx.queryParse!.pagination.currentPage *
            ctx.queryParse!.pagination.pageSize,
          take: ctx.queryParse!.pagination.pageSize,
        };

        if (
          ctx.queryParse?.orderQuery?.orderKey &&
          ctx.queryParse?.orderQuery?.orderType
        ) {
          findManyArgs.orderBy = {
            [ctx.queryParse?.orderQuery?.orderKey]:
              ctx.queryParse?.orderQuery?.orderType,
          };
        }

        const [data, count] = await Promise.all([
          prisma.user.findMany(findManyArgs),
          prisma.user.count({ where }),
        ]);

        return AppResponse.json({
          status: 200,
          data: {
            data,
            pagination: {
              currentPage: ctx.queryParse!.pagination.currentPage,
              pageSize: ctx.queryParse!.pagination.pageSize,
              count,
            },
          } as TGetUserListResponse,
        });
      }
    )
  )
);

const verifyExistUsername = async (username: string) => {
  const existingUsername = await prisma.account.count({
    where: {
      username,
    },
  });
  if (existingUsername) {
    return true;
  }
  return false;
};

export const POST = withValidateFieldHandler(
  null,
  null,
  PostUserCreateBodyDTO,
  withVerifyAccessToken(
    withVerifyCanDoAction(
      {
        resource: EPermissionResource.USER,
        action: EPermissionAction.CREATE,
      },
      async (
        _,
        ctx: THofContext<never, never, typeof PostUserCreateBodyDTO>
      ) => {
        const bodyParse = ctx.bodyParse!;
        const isExistsUsername = await verifyExistUsername(
          bodyParse.account.username
        );
        if (isExistsUsername) {
          return AppError.json({
            status: 409,
            message: "Username already taken",
          });
        }

        const res = await prisma.user.create({
          data: {
            fullName: bodyParse.fullName,
            type: bodyParse.type,
            account: {
              create: {
                type: bodyParse.type,
                username: bodyParse.account.username,
                password: await AuthService.hashPassword(
                  bodyParse.account.password
                ),
                roleId: bodyParse.account.roleId,
                isBlocked: bodyParse.account.isBlocked,
                isBanned: bodyParse.account.isBanned,
              },
            },
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
  DeleteUserBodyDTO,
  withVerifyAccessToken(
    withVerifyCanDoAction(
      {
        resource: "USER",
        action: "DELETE",
      },
      async (
        _: NextRequest,
        ctx: THofContext<never, never, typeof DeleteUserBodyDTO>
      ) => {
        const updated = await prisma.user.deleteMany({
          where: {
            id: { in: ctx.bodyParse?.ids },
          },
        });

        return AppResponse.json({ data: updated.count });
      }
    )
  )
);
