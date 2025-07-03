import { AppError } from "@/common/appError";
import { NextRequest } from "next/server";
import { QueryFailedError } from "typeorm";
import { THofContext } from "./type";
import { AppResponse } from "@/common/appResponse";

export const withErrorHandler = <T extends THofContext>(
  handler: (nextRequest: NextRequest, ctx: T) => Promise<AppError | AppResponse>
) => {
  return async (nextRequest: NextRequest, ctx: T) => {
    try {
      return await handler(nextRequest, ctx);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const pgError = error as QueryFailedError & { code?: string };

        if (pgError.code === "23505") {
          return AppError.json({ message: "Unique constraint violated" });
        }
        if (pgError.code === "23503") {
          return AppError.json({ message: "Foreign key invalid" });
        }
      }

      console.error("Unhandled error:", error);
      return AppError.json({ status: 500, message: "Internal Server Error" });
    }
  };
}
