import { TAppResponseInput } from "@/types/api/common"
import { NextResponse } from "next/server"

export class AppError {
  static status: number = 400
  static message: string = "Bad Request"

  static json<T = unknown>(ip?: TAppResponseInput) {
    return NextResponse.json(
      {
        isSuccess: false,
        message: ip?.message || AppError.message,
        data: ip?.data as T,
      },
      { status: ip?.status || AppError.status }
    )
  }
}
