import prisma from "@/constants/prisma";
import { EPermissionAction, EPermissionResource } from "@prisma/client";
import { NextRequest } from "next/server";
import { cache } from "react";
import { THofContext } from "./type";
import { AppError } from "@/common/server/appError";
import { AppResponse } from "@/common/server/appResponse";

type TDataCanDoAction = {
    resource: EPermissionResource
    action: EPermissionAction
}

const getPermissionsForRole = cache(async (roleId: string, data: TDataCanDoAction) => {
    return prisma.role.findFirst({
        where: {
            id: roleId,
            permissions: {
                some: {
                    action: data.action,
                    resource: data.resource,
                },
            },
        },
    });
});

export const withVerifyCanDoAction = <T extends THofContext>(
    data: TDataCanDoAction,
    callback: (req: NextRequest, prevCtx: T) => Promise<AppError | AppResponse>
) => async (req: NextRequest, ctx: T) => {
    const roleId = ctx.accessTokenCtx?.account.roleId;

    if (!roleId) {
        throw new Error(
            "Missing roleId: Make sure to wrap withVerifyCanDoAction inside withVerifyAccessToken"
        );
    }

    const res = await getPermissionsForRole(roleId, data)
    if (!res) {
        return AppError.json({ status: 403, message: "Permission Denied" })
    }

    return callback(req, ctx)
}
