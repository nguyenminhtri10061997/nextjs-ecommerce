import { getToken } from "@/common/dal"
import { AppError } from "@/common/server/appError"
import { AppEnvironment } from "@/constants/environment/appEnvironment"
import { JwtService } from "@/lib/auth/jwtService"
import { redirect } from "next/navigation"
import { NextRequest } from "next/server"
import prisma from "../../../../lib/prisma"
import { THofContext } from "./type"

export const withVerifyAccessToken = <T extends THofContext>(
  callback: (
    request: NextRequest,
    ctx: T & { accessTokenCtx: THofContext["accessTokenCtx"] }
  ) => Promise<Response>
) => {
  return async (request: NextRequest, prevCtx: T = {} as T) => {
    const { accessToken, refreshToken, cookie } = await getToken()
    if (!accessToken) {
      return AppError.json({ status: 401 })
    }
    let accessTokenDecoded
    try {
      accessTokenDecoded = await JwtService.verifyToken(accessToken)
    } catch {
      return AppError.json({ status: 401 })
    }

    // fresh token for this case is revoke user when logout
    const [account, refreshTokenDb] = await Promise.all([
      prisma.account.findUnique({
        where: { id: accessTokenDecoded?.accountId },
      }),
      prisma.refreshToken.findUnique({
        where: {
          id: accessTokenDecoded.sessionId,
        },
      }),
    ])

    if (
      !account ||
      !refreshTokenDb ||
      refreshTokenDb.expiresAt < new Date() ||
      // this is for case user change password and need to revoke access token from other device
      accessTokenDecoded.tokenVersion !== account.accessTokenVersion
    ) {
      cookie.delete(AppEnvironment.ACCESS_TOKEN_COOKIE_KEY)
      cookie.delete(AppEnvironment.REFRESH_TOKEN_COOKIE_KEY)
      return redirect("/login")
    }

    return callback(request, {
      ...prevCtx,
      accessTokenCtx: { account, refreshToken, cookie },
    })
  }
}
