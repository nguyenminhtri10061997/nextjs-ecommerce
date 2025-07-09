import { AppResponse } from "@/common/appResponse";
import { withValidateFieldHandler } from "@/lib/HOF/withValidateField";
import prisma from "@/lib/prisma";
import { idParamsDTO, patchBodyDTO } from "./validator";
import { THofContext } from "@/lib/HOF/type";
import { withVerifyAccessToken } from "@/lib/HOF/withVerifyAccessToken";
import { withVerifyCanDoAction } from "@/lib/HOF/withVerifyCanDoAction";
import { EPermissionAction, EPermissionResource, Prisma } from "@prisma/client";
import { AppError } from "@/common/appError";
import { AppStatusCode } from "@/common/statusCode";
import { AuthService } from "@/lib/auth/authService";

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
        });
        return AppResponse.json({ status: 200, data: res });
      }
    )
  )
);

export const PUT = withValidateFieldHandler(
  idParamsDTO,
  null,
  patchBodyDTO,
  withVerifyAccessToken(
    withVerifyCanDoAction(
      {
        resource: EPermissionResource.USER,
        action: EPermissionAction.UPDATE,
      },
      async (
        _,
        ctx: THofContext<typeof idParamsDTO, never, typeof patchBodyDTO>
      ) => {
        const { id } = ctx.paramParse!;
        const { fullName, type, account } = ctx.bodyParse!;
        const exist = await prisma.user.findUnique({
          where: {
            id,
          },
        });
        if (!exist) {
          return AppError.json({
            status: AppStatusCode.NOT_FOUND,
            message: "Not Found",
          });
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
          : null;
        if (existUsername) {
          return AppError.json({
            status: AppStatusCode.EXISTING,
            message: "Username already exists!",
          });
        }

        const objUpdate: Prisma.UserUpdateInput = {
          fullName,
          type,
        };

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
              accessTokenVersion: account.accessTokenVersion,
            },
          };
        }
        const res = await prisma.user.update({
          where: {
            id: exist.id,
          },
          data: objUpdate,
        });
        return AppResponse.json({ data: res });
      }
    )
  )
);
