import { AppError } from "@/common/appError";
import { AppResponse } from "@/common/appResponse";
import { AppStatusCode } from "@/common/statusCode";
import { THofContext } from "@/lib/HOF/type";
import { withValidateFieldHandler } from "@/lib/HOF/withValidateField";
import { withVerifyAccessToken } from "@/lib/HOF/withVerifyAccessToken";
import { withVerifyCanDoAction } from "@/lib/HOF/withVerifyCanDoAction";
import prisma from "@/lib/prisma";
import { EPermissionAction, EPermissionResource } from "@prisma/client";
import { IdParamsDTO, PutBodyDTO } from "./validator";

export const GET = withValidateFieldHandler(
  IdParamsDTO,
  null,
  null,
  withVerifyAccessToken(
    withVerifyCanDoAction(
      { resource: EPermissionResource.LANGUAGE, action: EPermissionAction.READ },
      async (_, ctx: THofContext<typeof IdParamsDTO>) => {
        const lang = await prisma.language.findUnique({
          where: { id: ctx.paramParse!.id },
        });

        if (!lang) {
          return AppError.json({ status: 404, message: "Language not found" });
        }

        return AppResponse.json({ status: 200, data: lang });
      }
    )
  )
);

export const PUT = withValidateFieldHandler(
  IdParamsDTO,
  null,
  PutBodyDTO,
  withVerifyAccessToken(
    withVerifyCanDoAction(
      { resource: EPermissionResource.LANGUAGE, action: EPermissionAction.UPDATE },
      async (_, ctx: THofContext<typeof IdParamsDTO, never, typeof PutBodyDTO>) => {
        const { id } = ctx.paramParse!;
        const { name, code, isActive, isDefault, } = ctx.bodyParse!;

        const lang = await prisma.language.findUnique({ where: { id } });
        if (!lang) {
          return AppError.json({ status: AppStatusCode.NOT_FOUND, message: "Language not found" });
        }

        const existed = await prisma.language.findFirst({
          where: { id: { not: id }, code },
        });
        if (existed) {
          return AppError.json({ status: AppStatusCode.EXISTING, message: "Language code already exists" });
        }

        const [updated] = await Promise.all([
          prisma.language.update({
            where: { id },
            data: { name, code, isActive,  isDefault, },
          }),
          isDefault ?
            prisma.language.updateMany({
              where: {
                id: {
                  not: lang.id,
                },
                isDefault: true,
              },
              data: {
                isDefault: false,
              }
            }) : null
        ]);

        return AppResponse.json({ status: 200, data: updated });
      }
    )
  )
);
