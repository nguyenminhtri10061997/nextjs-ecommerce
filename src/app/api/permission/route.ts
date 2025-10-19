import { AppResponse } from "@/common/server/appResponse";
import { THofContext } from "@/constants/HOF/type";
import { withValidateFieldHandler } from "@/constants/HOF/withValidateField";
import { withVerifyAccessToken } from "@/constants/HOF/withVerifyAccessToken";
import { withVerifyCanDoAction } from "@/constants/HOF/withVerifyCanDoAction";
import prisma from "@/constants/prisma";
import { TGetPermissionListResponse } from "@/types/api/permission";
import { EPermissionAction, EPermissionResource, Prisma } from "@prisma/client";
import {
    GetQueryDTO
} from "./validator";
import { getOrderBy, getSkipAndTake } from "@/common/client";

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