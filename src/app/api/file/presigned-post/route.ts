import { AppResponse } from "@/common/appResponse";
import { THofContext } from "@/lib/HOF/type";
import { withValidateFieldHandler } from "@/lib/HOF/withValidateField";
import { withVerifyAccessToken } from "@/lib/HOF/withVerifyAccessToken";
import AppS3Client from "@/lib/s3";
import { GetQueryDTO } from "./validator";
import { AppError } from "@/common/appError";

export const GET = withValidateFieldHandler(
  null,
  GetQueryDTO,
  null,
  withVerifyAccessToken(
    async (_, ctx: THofContext<never, typeof GetQueryDTO>) => {
      const { queryParse } = ctx;

      const { fileName, contentType } = queryParse!;

      try {
        const res = await AppS3Client.createPresignedPost({
          fileName,
          contentType,
        });
        return AppResponse.json({ status: 200, data: res });
      } catch (error) {
        console.error("Failed to get signed URL:", error);
        return AppError.json({
          data: "Failed to generate upload URL",
          status: 500,
        });
      }
    }
  )
);
