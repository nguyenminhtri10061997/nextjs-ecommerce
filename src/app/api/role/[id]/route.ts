import { AppError } from "@/common/appError";
import { AppResponse } from "@/common/appResponse";
import { AppStatusCode } from "@/common/statusCode";
import { THofContext } from "@/lib/HOF/type";
import { withValidateFieldHandler } from "@/lib/HOF/withValidateField";
import { withVerifyAccessToken } from "@/lib/HOF/withVerifyAccessToken";
import { withVerifyCanDoAction } from "@/lib/HOF/withVerifyCanDoAction";
import prisma from "@/lib/prisma";
import { EPermissionAction, EPermissionResource, Prisma } from "@prisma/client";
import { idParamsDTO, putBodyDTO } from "./validator";

export const GET = withValidateFieldHandler(
    idParamsDTO,
    null,
    null,
    withVerifyAccessToken(
        withVerifyCanDoAction({
            resource: EPermissionResource.ROLE,
            action: EPermissionAction.READ,
        },
            async (_, ctx: THofContext<typeof idParamsDTO>) => {
                const res = await prisma.role.findUnique({
                    where: {
                        id: ctx.paramParse!.id
                    },
                    include: {
                        permissions: {
                            select: {
                                id: true,
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
            resource: EPermissionResource.ROLE,
            action: EPermissionAction.UPDATE,
        },
            async (_, ctx: THofContext<typeof idParamsDTO, never, typeof putBodyDTO>) => {
                const { id } = ctx.paramParse!
                const bodyParse = ctx.bodyParse!
                const [exist, existUsername] = await Promise.all([
                    prisma.role.findUnique({
                        where: {
                            id,
                        }
                    }),
                    prisma.role.findFirst({
                        where: {
                            id: {
                                not: id,
                            },
                            name: bodyParse.name,
                        },
                    })
                ])
                if (!exist) {
                    return AppError.json({ status: AppStatusCode.NOT_FOUND, message: "Not Found" })
                }
                if (existUsername) {
                    return AppError.json({ status: AppStatusCode.EXISTING, message: "name already exists!" })
                }

                const objUpdate: Prisma.RoleUpdateInput = {
                    name: bodyParse.name,
                    description: bodyParse.description,
                    permissions: { connect: bodyParse.permissionIds.map(id => ({ id })) }
                }

                const res = await prisma.role.update({
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