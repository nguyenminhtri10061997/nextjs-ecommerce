import { AppError } from "@/common/server/appError";
import { AppResponse } from "@/common/server/appResponse";
import { withValidateFieldHandler } from "@/constants/HOF/withValidateField";
import prisma from "@/constants/prisma";
import { AuthService } from "@/lib/auth/authService";
import { JwtService } from "@/lib/auth/jwtService";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { PostAccountLoginBodyDTO } from "./validator";
import { THofContext } from "@/constants/HOF/type";
import { defaultCookieOption } from "@/constants";

export const POST = withValidateFieldHandler(
  null,
  null,
  PostAccountLoginBodyDTO,
  async (
    request: NextRequest,
    ctx: THofContext<never, never, typeof PostAccountLoginBodyDTO>
  ) => {
    const account = await AuthService.checkAccount(ctx.bodyParse!);

    if (!account) {
      return AppError.json({ status: 401 });
    }

    const { ipAddress, userAgent } = AuthService.getClientInfo(request);

    await prisma.refreshToken.deleteMany({
      where: {
        accountId: account.id,
        ipAddress,
        userAgent,
      },
    });

    const { refreshToken, refreshTokenExpiresAt } =
      await JwtService.generateRefreshTokenAndExpires(account);

    const newRefreshToken = await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        expiresAt: refreshTokenExpiresAt,
        ipAddress,
        userAgent,
        accountId: account.id,
      },
    });

    const accessToken = await JwtService.generateAccessToken({
      accountId: account.id,
      tokenVersion: account.accessTokenVersion,
      sessionId: newRefreshToken.id,
    });

    const cookieStore = await cookies();

    cookieStore.set("accessToken", accessToken, defaultCookieOption);

    cookieStore.set("refreshToken", newRefreshToken.token, {
      ...defaultCookieOption,
      expires: refreshTokenExpiresAt,
    });

    return AppResponse.json();
  }
);
