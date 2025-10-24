import { AppError } from "@/common/server/appError";
import { AppResponse } from "@/common/server/appResponse";
import { AppStatusCode } from "@/common/statusCode";
import { THofContext } from "@/lib/HOF/type";
import { withValidateFieldHandler } from "@/lib/HOF/withValidateField";
import { withVerifyAccessToken } from "@/lib/HOF/withVerifyAccessToken";
import { withVerifyCanDoAction } from "@/lib/HOF/withVerifyCanDoAction";
import prisma from "@/lib/prisma";
import { EPermissionAction, EPermissionResource, Prisma } from "@prisma/client";
import { idParamsDTO, PatchBodyDTO } from "./validator";

export const GET = withValidateFieldHandler(
  idParamsDTO,
  null,
  null,
  withVerifyAccessToken(
    withVerifyCanDoAction(
      {
        resource: EPermissionResource.ROLE,
        action: EPermissionAction.READ,
      },
      async (_, ctx: THofContext<typeof idParamsDTO>) => {
        const res = await prisma.role.findUnique({
          where: {
            id: ctx.paramParse!.id,
          },
          include: {
            permissions: {
              select: {
                id: true,
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
  PatchBodyDTO,
  withVerifyAccessToken(
    withVerifyCanDoAction(
      {
        resource: EPermissionResource.ROLE,
        action: EPermissionAction.UPDATE,
      },
      async (
        _,
        ctx: THofContext<typeof idParamsDTO, never, typeof PatchBodyDTO>
      ) => {
        const { id } = ctx.paramParse!;
        const { name, description, permissionIds } = ctx.bodyParse!;

        const exist = await prisma.role.findUnique({
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

        const existUsername = name
          ? await prisma.role.findFirst({
              where: {
                id: {
                  not: id,
                },
                name,
              },
            })
          : null;

        if (existUsername) {
          return AppError.json({
            status: AppStatusCode.EXISTING,
            message: "name already exists!",
          });
        }

        const objUpdate: Prisma.RoleUpdateInput = {
          name,
          description,
        };

        if (permissionIds) {
          objUpdate.permissions = {
            set: permissionIds.map((id) => ({ id })),
          };
        }

        const res = await prisma.role.update({
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
