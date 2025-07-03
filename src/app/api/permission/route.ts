import { AppResponse } from "@/common/appResponse";
import { THofContext } from "@/lib/HOF/type";
import { withValidateFieldHandler } from "@/lib/HOF/withValidateField";
import { withVerifyAccessToken } from "@/lib/HOF/withVerifyAccessToken";
import { withVerifyCanDoAction } from "@/lib/HOF/withVerifyCanDoAction";
import prisma from "@/lib/prisma";
import { TGetPermissionListResponse } from "@/types/api/permission";
import { EPermissionAction, EPermissionResource, Prisma } from "@prisma/client";
import {
    GetQueryDTO
} from "./validator";
import { getOrderBy, getSkipAndTake } from "@/common";

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