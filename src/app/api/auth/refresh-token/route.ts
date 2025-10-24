import { AppError } from "@/common/server/appError"
import { AppResponse } from "@/common/server/appResponse"
import { getToken } from "@/common/dal"
import { AppEnvironment } from "@/constants/environment/appEnvironment"
import { AuthService } from "@/lib/auth/authService"
import { JwtService } from "@/lib/auth/jwtService"
import prisma from "@/lib/prisma"
import dayjs from "dayjs"
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies"
import { NextRequest } from "next/server"

const deleteCookiesAndReturnError = (cookie: ReadonlyRequestCookies) => {
  cookie.delete(AppEnvironment.ACCESS_TOKEN_COOKIE_KEY)
  cookie.delete(AppEnvironment.REFRESH_TOKEN_COOKIE_KEY)
  return AppError.json({ status: 401 })
}

export async function POST(request: NextRequest) {
  const resGetToken = await getToken()
  const { ipAddress, userAgent } = AuthService.getClientInfo(request)

  if (!resGetToken.refreshToken) {
    return deleteCookiesAndReturnError(resGetToken.cookie)
  }

  let refreshTokenDecoded
  try {
    refreshTokenDecoded = JwtService.verifyToken(resGetToken.refreshToken)
  } catch {
    return deleteCookiesAndReturnError(resGetToken.cookie)
  }

  const refreshToken = await prisma.refreshToken.findFirst({
    where: {
      token: resGetToken.refreshToken,
      ipAddress,
      userAgent,
    },
    select: {
      id: true,
      accountId: true,
      expiresAt: true,
    },
  })

  if (!refreshToken) {
    return deleteCookiesAndReturnError(resGetToken.cookie)
  }

  if (refreshToken && refreshToken.expiresAt < new Date()) {
    await prisma.refreshToken.delete({
      where: {
        id: refreshToken.id,
      },
    })
    return deleteCookiesAndReturnError(resGetToken.cookie)
  }

  const account = await prisma.account.findUnique({
    where: { id: refreshTokenDecoded.accountId },
  })

  if (!account) {
    return deleteCookiesAndReturnError(resGetToken.cookie)
  }

  const accessToken = await JwtService.generateAccessToken({
    accountId: account.id,
    tokenVersion: account.accessTokenVersion,
    sessionId: refreshToken.id,
  })

  const accessTokenExpiresAt = dayjs()
    .add(JwtService.jwtAccessExpiresValue, JwtService.jwtAccessExpiresUnit)
    .toDate()

  resGetToken.cookie.set("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    expires: accessTokenExpiresAt,
    sameSite: "lax",
    path: "/",
  })

  return AppResponse.json()
}
