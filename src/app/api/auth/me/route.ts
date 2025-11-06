import { withVerifyAccessToken } from "@/app/api/_lib/HOF/withVerifyAccessToken"
import { AppResponse } from "@/common/server/appResponse"
import prisma from "@/lib/prisma"
import { TPostMeResponse } from "@/types/api/auth/meResponse"
import { EPermissionAction, EPermissionResource } from "@prisma/client"
import { NextRequest } from "next/server"

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
        permission: {
          select: {
            action: true,
            resource: true,
          },
        },
      },
    }),
  ])

  const permissionHash: { [key in EPermissionResource]?: EPermissionAction[] } =
    {}
  role?.permission.forEach((i) => {
    if (!permissionHash[i.resource as EPermissionResource]) {
      permissionHash[i.resource as EPermissionResource] = []
    }
    permissionHash[i.resource as EPermissionResource]!.push(i.action)
  })

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
  })
})
