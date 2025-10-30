import { AppResponse } from "@/common/server/appResponse";
import { AppEnvironment } from "@/environment/appEnvironment";
import { withVerifyAccessToken } from "@/app/api/_lib/HOF/withVerifyAccessToken";
import prisma from "@/lib/prisma";
import { AuthService } from "@/lib/auth/authService";
import { NextRequest } from "next/server";

export const POST = withVerifyAccessToken(async (request: NextRequest, ctx) => {
  const { accessTokenCtx } = ctx

  const { ipAddress, userAgent } = AuthService.getClientInfo(request);

  await prisma.refreshToken.deleteMany({
    where: {
      accountId: accessTokenCtx?.account.id,
      ipAddress,
      userAgent,
    }
  });

  accessTokenCtx?.cookie.delete(AppEnvironment.ACCESS_TOKEN_COOKIE_KEY);
  accessTokenCtx?.cookie.delete(AppEnvironment.REFRESH_TOKEN_COOKIE_KEY);

  return AppResponse.json();
})