import { AppResponse } from "@/common/server/appResponse";
import { THofContext } from "@/app/api/_lib/HOF/type";
import { withValidateFieldHandler } from "@/app/api/_lib/HOF/withValidateField";
import { withVerifyAccessToken } from "@/app/api/_lib/HOF/withVerifyAccessToken";
import { withVerifyCanDoAction } from "@/app/api/_lib/HOF/withVerifyCanDoAction";
import prisma from "@/lib/prisma";
import { TGetPermissionListResponse } from "@/types/api/permission";
import { EPermissionAction, EPermissionResource, Prisma } from "@prisma/client";
import {
    GetQueryDTO
} from "./validator";
import { getOrderBy, getSkipAndTake } from "@/common/server";

export const GET = withValidateFieldHandler(
    null,
    GetQueryDTO,
    null,
    withVerifyAccessToken(
        withVerifyCanDoAction(
            {
                resource: EPermissionResource.USER,
                action: EPermissionAction.READ,
            },
            async (_, ctx: THofContext<never, typeof GetQueryDTO>) => {
                const { action, resource, orderQuery, pagination } = ctx.queryParse || {};
                const where: Prisma.PermissionWhereInput = {
                    action: action || undefined,
                    resource: resource || undefined,
                };

                const {
                    skip,
                    take,
                } = getSkipAndTake(pagination)

                const findManyArgs: Prisma.PermissionFindManyArgs = {
                    where,
                    skip,
                    take,
                    orderBy: getOrderBy(orderQuery),
                };

                const [data, count] = await Promise.all([
                    prisma.permission.findMany(findManyArgs),
                    prisma.permission.count({ where }),
                ]);

                return AppResponse.json({
                    status: 200,
                    data: {
                        data,
                        pagination: pagination ? {
                            ...pagination,
                            count,
                        } : undefined,
                    } as TGetPermissionListResponse,
                });
            }
        )
    )
);