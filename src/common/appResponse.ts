import { TAppResponseBody, TAppResponseInput } from "@/types/api/common";
import { NextResponse } from "next/server";
export class AppResponse {
  static status: number = 200;
  static message: string = 'success'

  static json<T = unknown>(ip?: TAppResponseInput) {
    return NextResponse.json<TAppResponseBody<T>>(
      { isSuccess: true, message: ip?.message || AppResponse.message, data: ip?.data as T },
      { status: ip?.status || AppResponse.status }
    );
  }
}
