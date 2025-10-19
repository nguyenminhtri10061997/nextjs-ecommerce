import { AppError } from "@/common/server/appError";
import { AppResponse } from "@/common/server/appResponse";
import { AppEnvironment } from "@/constants/appEnvironment";
import { getToken } from "@/common/dal";
import prisma from "@/constants/prisma";
import { AuthService } from "@/lib/auth/authService";
import { JwtService } from "@/lib/auth/jwtService";
import dayjs from "dayjs";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { NextRequest } from "next/server";
import { defaultCookieOption } from "@/constants";

const deleteCookiesAndReturnError = (cookie: ReadonlyRequestCookies) => {
  cookie.delete(AppEnvironment.ACCESS_TOKEN_COOKIE_KEY);
  cookie.delete(AppEnvironment.REFRESH_TOKEN_COOKIE_KEY);
  return AppError.json({ status: 401 });
};

export async function POST(request: NextRequest) {
  const resGetToken = await getToken();
  const { ipAddress, userAgent } = AuthService.getClientInfo(request);

  if (!resGetToken.refreshToken) {
    return deleteCookiesAndReturnError(resGetToken.cookie);
  }

  let refreshTokenDecoded;
  try {
    refreshTokenDecoded = JwtService.verifyRefreshToken(
      resGetToken.refreshToken
    );
  } catch {
    return deleteCookiesAndReturnError(resGetToken.cookie);
  }

  const refreshToken = await prisma.refreshToken.findFirst({
    where: {
      token: resGetToken.refreshToken,
      ipAddress,
      userAgent,
      accountId: refreshTokenDecoded.accountId,
    },
    select: {
      id: true,
      accountId: true,
      expiresAt: true,
    },
  });

  if (!refreshToken) {
    return deleteCookiesAndReturnError(resGetToken.cookie);
  }

  if (refreshToken && refreshToken.expiresAt < new Date()) {
    await prisma.refreshToken.delete({
      where: {
        id: refreshToken.id,
      },
    });
    return deleteCookiesAndReturnError(resGetToken.cookie);
  }

  const account = await prisma.account.findUnique({
    where: { id: refreshToken.accountId },
  });

  if (!account) {
    return deleteCookiesAndReturnError(resGetToken.cookie);
  }

  const accessToken = await JwtService.generateAccessToken({
    accountId: account.id,
    tokenVersion: account.accessTokenVersion,
    sessionId: refreshToken.id,
  });

  const accessTokenExpiresAt = dayjs()
    .add(JwtService.jwtAccessExpiresValue, JwtService.jwtAccessExpiresUnit)
    .toDate();

  resGetToken.cookie.set("accessToken", accessToken, {
    ...defaultCookieOption,
    expires: accessTokenExpiresAt,
  });

  return AppResponse.json();
}
