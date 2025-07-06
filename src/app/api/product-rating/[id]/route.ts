import { AppError } from "@/common/appError";
import { AppResponse } from "@/common/appResponse";
import { AppStatusCode } from "@/common/statusCode";
import { THofContext } from "@/lib/HOF/type";
import { withValidateFieldHandler } from "@/lib/HOF/withValidateField";
import { withVerifyAccessToken } from "@/lib/HOF/withVerifyAccessToken";
import { withVerifyCanDoAction } from "@/lib/HOF/withVerifyCanDoAction";
import prisma from "@/lib/prisma";
import { EPermissionAction, EPermissionResource } from "@prisma/client";
import { IdParamsDTO, PatchBodyDTO } from "./validator";

export const GET = withValidateFieldHandler(
  IdParamsDTO,
  null,
  null,
  withVerifyAccessToken(
    withVerifyCanDoAction(
      {
        resource: EPermissionResource.PRODUCT_RATING,
        action: EPermissionAction.READ,
      },
      async (_, ctx: THofContext<typeof IdParamsDTO>) => {
        const rating = await prisma.productRating.findUnique({
          where: { id: ctx.paramParse!.id },
        });

        if (!rating) {
          return AppError.json({ status: 404, message: "Rating not found" });
        }

        return AppResponse.json({ status: 200, data: rating });
      }
    )
  )
);

export const PUT = withValidateFieldHandler(
  IdParamsDTO,
  null,
  PatchBodyDTO,
  withVerifyAccessToken(
    withVerifyCanDoAction(
      {
        resource: EPermissionResource.PRODUCT_RATING,
        action: EPermissionAction.UPDATE,
      },
      async (
        _,
        ctx: THofContext<typeof IdParamsDTO, never, typeof PatchBodyDTO>
      ) => {
        const { id } = ctx.paramParse!;
        const { account: currentAccount } = ctx.accessTokenCtx!;
        const { rating, title, detail, video, images, isVerify } =
          ctx.bodyParse!;

        const existing = await prisma.productRating.findUnique({
          where: { id },
        });
        if (!existing) {
          return AppError.json({
            status: AppStatusCode.NOT_FOUND,
            message: "Rating not found",
          });
        }

        const updated = await prisma.productRating.update({
          where: { id },
          data: {
            rating,
            title,
            detail,
            video,
            images,
            isVerify,
            verifyByUserId:
              isVerify === undefined ? undefined : currentAccount.userId,
          },
        });

        return AppResponse.json({ status: 200, data: updated });
      }
    )
  )
);
