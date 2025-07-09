import { AppError } from "@/common/appError";
import { AppResponse } from "@/common/appResponse";
import { AppEnvironment } from "@/environment/appEnvironment";
import { JwtService } from "@/lib/auth/jwtService";
import { reGenTokenIfNotMatchVersion } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import { getToken } from "../dal";
import prisma from "../prisma";
import { THofContext } from "./type";

export const withVerifyAccessToken = <T extends THofContext>(
    callback: (request: NextRequest, ctx: T & { accessTokenCtx: THofContext['accessTokenCtx'] }) => Promise<AppError | AppResponse>
) => {
    return async (request: NextRequest, prevCtx: T = {} as T) => {
        const { accessToken, refreshToken, cookie } = await getToken();
        if (!accessToken) {
            return AppError.json({ status: 401 })
        }
        let accessTokenDecoded
        try {
            accessTokenDecoded = await JwtService.verifyToken(accessToken);
        } catch(err) {
            return AppError.json({ status: 401 })
        }
        const [account, refreshTokenDb] = await Promise.all([
            prisma.account.findUnique({ where: { id: accessTokenDecoded?.accountId } }),
            prisma.refreshToken.findUnique({
                where: {
                    id: accessTokenDecoded.sessionId,
                }
            }),
        ])

        if (!account || !refreshTokenDb || refreshTokenDb.expiresAt < new Date()) {
            cookie.delete(AppEnvironment.ACCESS_TOKEN_COOKIE_KEY);
            cookie.delete(AppEnvironment.REFRESH_TOKEN_COOKIE_KEY);
            return redirect("/login");
        }

        if (accessTokenDecoded.tokenVersion !== account.accessTokenVersion) {
            await reGenTokenIfNotMatchVersion(account, refreshTokenDb.id, cookie)
        }
        return callback(request, { ...prevCtx, accessTokenCtx: { account, refreshToken, cookie } });
    }
};