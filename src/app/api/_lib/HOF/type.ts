import { Account } from "@prisma/client";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { output, ZodObject } from "zod/v4";

type verifyAccessTokenCtx = {
    account: Account
    refreshToken: string
    cookie: ReadonlyRequestCookies
}

export type THofContext<TParam extends ZodObject = never, TQuery extends ZodObject = never, TBody extends ZodObject = never> = {
    params?: Promise<unknown>
    paramParse?: output<TParam>
    queryParse?: output<TQuery>
    bodyParse?: output<TBody>
    accessTokenCtx?: verifyAccessTokenCtx
};