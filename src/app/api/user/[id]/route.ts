import { AppResponse } from "@/common/appResponse";
import { withValidateFieldHandler } from "@/lib/HOF/withValidateField";
import prisma from "@/lib/prisma";
import { idParamsDTO, putBodyDTO } from "./validator";
import { THofContext } from "@/lib/HOF/type";
import { withVerifyAccessToken } from "@/lib/HOF/withVerifyAccessToken";
import { withVerifyCanDoAction } from "@/lib/HOF/withVerifyCanDoAction";
import { EPermissionAction, EPermissionResource, Prisma } from "@prisma/client";
import { AppError } from "@/common/appError";
import { AppStatusCode } from "@/common/statusCode";
import { AuthService } from "@/modules/auth/authService";

export const GET = withValidateFieldHandler(
    idParamsDTO,
    null,
    null,
    withVerifyAccessToken(
        withVerifyCanDoAction({
            resource: EPermissionResource.USER,
            action: EPermissionAction.READ,
        },
            async (_, ctx: THofContext<typeof idParamsDTO>) => {
                const res = await prisma.user.findUnique({
                    where: {
                        id: ctx.paramParse!.id
                    },
                    include: {
                        account: {
                            omit: {
                                password: true
                            }
                        },
                    }
                })
                return AppResponse.json({ status: 200, data: res });
            }
        )
    )
)

export const PUT = withValidateFieldHandler(
    idParamsDTO,
    null,
    putBodyDTO,
    withVerifyAccessToken(
        withVerifyCanDoAction({
            resource: EPermissionResource.USER,
            action: EPermissionAction.UPDATE,
        },
            async (_, ctx: THofContext<typeof idParamsDTO, never, typeof putBodyDTO>) => {
                const { id } = ctx.paramParse!
                const bodyParse = ctx.bodyParse!
                const [exist, existUsername] = await Promise.all([
                    prisma.user.findUnique({
                        where: {
                            id,
                        }
                    }),
                    prisma.user.findFirst({
                        where: {
                            id: {
                                not: id,
                            },
                            account: {
                                is: {
                                    username: bodyParse.account.username
                                }
                            }
                        },
                    })
                ])
                if (!exist) {
                    return AppError.json({ status: AppStatusCode.NOT_FOUND, message: "Not Found" })
                }
                if (existUsername) {
                    return AppError.json({ status: AppStatusCode.EXISTING, message: "Username already exists!" })
                }

                const objUpdate: Prisma.UserUpdateInput = {
                    fullName: bodyParse.fullName,
                    type: bodyParse.type,
                    account: {
                        update: {
                            type: bodyParse.type,
                            username: bodyParse.account.username,
                            password: bodyParse.account.newPassword ? await AuthService.hashPassword(bodyParse.account.newPassword) : undefined,
                            roleId: bodyParse.account.roleId,
                            isBlocked: bodyParse.account.isBlocked,
                            isBanned: bodyParse.account.isBanned,
                            accessTokenVersion: bodyParse.account.accessTokenVersion,
                        }
                    }
                }

                const res = await prisma.user.update({
                    where: {
                        id: exist.id,
                    },
                    data: objUpdate
                })
                return AppResponse.json({ data: res });
            }
        )
    )
)