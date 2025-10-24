import { AppError } from "@/common/server/appError";
import { AppResponse } from "@/common/server/appResponse";
import { THofContext } from "@/lib/HOF/type";
import { withValidateFieldHandler } from "@/lib/HOF/withValidateField";
import { withVerifyAccessToken } from "@/lib/HOF/withVerifyAccessToken";
import { withVerifyCanDoAction } from "@/lib/HOF/withVerifyCanDoAction";
import prisma from "@/lib/prisma";
import { ESearchType } from "@/lib/zod/paginationDTO";
import { TGetRoleListResponse } from "@/types/api/role";
import { EPermissionAction, EPermissionResource, Prisma } from "@prisma/client";
import dayjs from "dayjs";
import { NextRequest } from "next/server";
import {
  DeleteBodyDTO,
  GetQueryDTO,
  PostCreateBodyDTO,
} from "./validator";
import { getOrderBy, getSkipAndTake } from "@/common";

export const GET = withValidateFieldHandler(
  null,
  GetQueryDTO,
  null,
  withVerifyAccessToken(
    withVerifyCanDoAction(
      {
        resource: EPermissionResource.ROLE,
        action: EPermissionAction.READ,
      },
      async (_, ctx: THofContext<never, typeof GetQueryDTO>) => {
        const { searchQuery, dateRangeQuery, pagination, orderQuery } = ctx.queryParse || {}
        const where: Prisma.RoleWhereInput = {};

        if (searchQuery?.searchKey && searchQuery?.searchStr) {
          const key = searchQuery.searchKey as keyof Prisma.RoleWhereInput;
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

        const {
          skip,
          take,
        } = getSkipAndTake(pagination)

        const findManyArgs: Prisma.RoleFindManyArgs = {
          where,
          skip,
          take,
          orderBy: getOrderBy(orderQuery),
        };

        const [data, count] = await Promise.all([
          prisma.role.findMany(findManyArgs),
          skip && take ? prisma.role.count({ where }) : undefined,
        ]);

        return AppResponse.json({
          status: 200,
          data: {
            data,
            pagination: pagination ? {
              ...pagination,
              count,
            } : undefined,
          } as TGetRoleListResponse,
        });
      }
    )
  )
);

const verifyExist = async (name: string) => {
  const existingUsername = await prisma.role.count({
    where: {
      name,
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
  PostCreateBodyDTO,
  withVerifyAccessToken(
    withVerifyCanDoAction(
      {
        resource: EPermissionResource.ROLE,
        action: EPermissionAction.CREATE,
      },
      async (
        _,
        ctx: THofContext<never, never, typeof PostCreateBodyDTO>
      ) => {
        const { name, description, permissionIds } = ctx.bodyParse!;
        const isExists = await verifyExist(
          name
        );
        if (isExists) {
          return AppError.json({
            status: 409,
            message: "name already taken",
          });
        }

        const res = await prisma.role.create({
          data: {
            name,
            description,
            permissions: { connect: permissionIds.map(id => ({ id })) }
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
        resource: "ROLE",
        action: "DELETE",
      },
      async (
        _: NextRequest,
        ctx: THofContext<never, never, typeof DeleteBodyDTO>
      ) => {
        const updated = await prisma.role.deleteMany({
          where: {
            id: { in: ctx.bodyParse?.ids },
          },
        });

        return AppResponse.json({ data: updated.count });
      }
    )
  )
);
