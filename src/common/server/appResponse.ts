import { TAppResponseInput } from "@/types/api/common"
export class AppResponse {
  static status: number = 200
  static message: string = "success"

  static json<T = unknown>(ip?: TAppResponseInput) {
    return Response.json(
      {
        isSuccess: true,
        message: ip?.message || AppResponse.message,
        data: ip?.data as T,
      },
      { status: ip?.status || AppResponse.status }
    )
  }
}
