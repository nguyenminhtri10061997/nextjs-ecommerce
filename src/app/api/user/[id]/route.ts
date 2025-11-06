import { THofContext } from "@/app/api/_lib/HOF/type"
import { withValidateFieldHandler } from "@/app/api/_lib/HOF/withValidateField"
import { withVerifyAccessToken } from "@/app/api/_lib/HOF/withVerifyAccessToken"
import { withVerifyCanDoAction } from "@/app/api/_lib/HOF/withVerifyCanDoAction"
import { AppError } from "@/common/server/appError"
import { AppResponse } from "@/common/server/appResponse"
import { AppStatusCode } from "@/common/server/statusCode"
import { AuthService } from "@/lib/auth/authService"
import prisma from "@/lib/prisma"
import { EPermissionAction, EPermissionResource, Prisma } from "@prisma/client"
import { idParamsDTO, PatchBodyDTO } from "./validator"

export const GET = withValidateFieldHandler(
  idParamsDTO,
  null,
  null,
  withVerifyAccessToken(
    withVerifyCanDoAction(
      {
        resource: EPermissionResource.USER,
        action: EPermissionAction.READ,
      },
      async (_, ctx: THofContext<typeof idParamsDTO>) => {
        const res = await prisma.user.findUnique({
          where: {
            id: ctx.paramParse!.id,
          },
          include: {
            account: {
              omit: {
                password: true,
              },
            },
          },
        })
        return AppResponse.json({ status: 200, data: res })
      }
    )
  )
)

export const PUT = withValidateFieldHandler(
  idParamsDTO,
  null,
  PatchBodyDTO,
  withVerifyAccessToken(
    withVerifyCanDoAction(
      {
        resource: EPermissionResource.USER,
        action: EPermissionAction.UPDATE,
      },
      async (
        _,
        ctx: THofContext<typeof idParamsDTO, never, typeof PatchBodyDTO>
      ) => {
        const { id } = ctx.paramParse!
        const { fullName, type, account } = ctx.bodyParse!
        const exist = await prisma.user.findUnique({
          where: {
            id,
          },
          include: {
            account: true,
          },
        })
        if (!exist) {
          return AppError.json({
            status: AppStatusCode.NOT_FOUND,
            message: "Not Found",
          })
        }

        const existUsername = account
          ? await prisma.user.findFirst({
              where: {
                id: {
                  not: id,
                },
                account: {
                  is: {
                    username: account.username,
                  },
                },
              },
            })
          : null
        if (existUsername) {
          return AppError.json({
            status: AppStatusCode.EXISTING,
            message: "Username already exists!",
          })
        }

        const objUpdate: Prisma.UserUpdateInput = {
          fullName,
          type,
        }

        if (account) {
          objUpdate.account = {
            update: {
              type,
              username: account.username,
              password: account.newPassword
                ? await AuthService.hashPassword(account.newPassword)
                : undefined,
              roleId: account.roleId,
              isBlocked: account.isBlocked,
              isBanned: account.isBanned,
            },
          }

          const { account: accountDb } = exist

          const isNeedToIncreaseTokenVersion =
            accountDb?.username !== account.username ||
            (account.isBanned && accountDb?.isBanned !== account.isBanned) ||
            (account.isBlocked && accountDb?.isBlocked !== account.isBlocked) ||
            account.newPassword
          if (isNeedToIncreaseTokenVersion) {
            objUpdate.account.update!.accessTokenVersion =
              (accountDb?.accessTokenVersion || 0) + 1
          }
        }
        const res = await prisma.user.update({
          where: {
            id: exist.id,
          },
          data: objUpdate,
        })
        return AppResponse.json({ data: res })
      }
    )
  )
)
