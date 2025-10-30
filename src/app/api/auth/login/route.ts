import { AppError } from "@/common/server/appError";
import { AppResponse } from "@/common/server/appResponse";
import { AuthService } from "@/lib/auth/authService";
import { JwtService } from "@/lib/auth/jwtService";
import { THofContext } from "@/app/api/_lib/HOF/type";
import { withValidateFieldHandler } from "@/app/api/_lib/HOF/withValidateField";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { PostAccountLoginBodyDTO } from "./validator";

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

    cookieStore.set("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
    });

    cookieStore.set("refreshToken", newRefreshToken.token, {
      httpOnly: true,
      secure: true,
      expires: refreshTokenExpiresAt,
      sameSite: "lax",
      path: "/",
    });

    return AppResponse.json();
  }
);
