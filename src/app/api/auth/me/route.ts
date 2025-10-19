import { AppResponse } from "@/common/server/appResponse";
import { withVerifyAccessToken } from "@/constants/HOF/withVerifyAccessToken";
import prisma from "@/constants/prisma";
import { EPermissionAction, EPermissionResource } from "@prisma/client";
import { NextRequest } from "next/server";
import { TPostMeResponse } from "./types";

export const GET = withVerifyAccessToken(async (_: NextRequest, ctx) => {
  const [user, role] = await Promise.all([
    prisma.user.findUnique({
      where: {
        id: ctx.accessTokenCtx?.account.id,
      },
    }),
    prisma.role.findUnique({
      where: {
        id: ctx.accessTokenCtx?.account.roleId,
      },
      select: {
        id: true,
        name: true,
        permissions: {
          select: {
            action: true,
            resource: true,
          },
        },
      },
    }),
  ]);

  const permissionHash: { [key in EPermissionResource]?: EPermissionAction[] } =
    {};
  role!.permissions.forEach((i) => {
    if (!permissionHash[i.resource as EPermissionResource]) {
      permissionHash[i.resource as EPermissionResource] = [];
    }
    permissionHash[i.resource as EPermissionResource]!.push(i.action);
  });

  return AppResponse.json({
    data: {
      account: ctx.accessTokenCtx?.account,
      user,
      role: {
        id: role!.id,
        name: role!.name,
        permissions: permissionHash,
      },
    } as TPostMeResponse,
  });
});
