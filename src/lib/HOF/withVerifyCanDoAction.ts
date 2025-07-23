import prisma from "@/lib/prisma";
import { EPermissionAction, EPermissionResource } from "@prisma/client";
import { NextRequest } from "next/server";
import { cache } from "react";
import { THofContext } from "./type";
import { AppError } from "@/common/appError";
import { AppResponse } from "@/common/appResponse";

type TDataCanDoAction = {
    resource: EPermissionResource
    action: EPermissionAction
}


type TDataCanDoActions = {
    resource: EPermissionResource
    actions: EPermissionAction[]
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


const getPermissionsForRoles = cache(async (roleId: string, datas: TDataCanDoActions[]) => {
    return prisma.role.findFirst({
        where: {
            id: roleId,
            permissions: {
                some: {
                    OR: datas.map(i => ({
                        resource: i.resource,
                        action: { in: i.actions },
                    }))
                }
            },
        },
    });
});


export const withVerifyCanDoActions = <T extends THofContext>(
    datas: TDataCanDoActions[],
    callback: (req: NextRequest, prevCtx: T) => Promise<AppError | AppResponse>
) => async (req: NextRequest, ctx: T) => {
    const roleId = ctx.accessTokenCtx?.account.roleId;

    if (!roleId) {
        throw new Error(
            "Missing roleId: Make sure to wrap withVerifyCanDoAction inside withVerifyAccessToken"
        );
    }

    const res = await getPermissionsForRoles(roleId, datas)
    if (!res) {
        return AppError.json({ status: 403, message: "Permission Denied" })
    }

    return callback(req, ctx)
}

