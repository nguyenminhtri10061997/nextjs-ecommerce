import { Account } from "@prisma/client";
import dayjs from "dayjs";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { JwtService } from "./jwtService";

export const reGenTokenIfNotMatchVersion = async (account: Account, sessionId: string, cookie: ReadonlyRequestCookies) => {
    const accessToken = await JwtService.generateAccessToken({
        accountId: account.id,
        tokenVersion: account.accessTokenVersion,
        sessionId,
    });

    const accessTokenExpiresAt = dayjs()
        .add(JwtService.jwtAccessExpiresValue, JwtService.jwtAccessExpiresUnit)
        .toDate();

    cookie.set("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        expires: accessTokenExpiresAt,
        sameSite: "lax",
        path: "/",
    });
}