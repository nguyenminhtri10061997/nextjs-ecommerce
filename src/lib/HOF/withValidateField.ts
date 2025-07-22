import { AppError } from "@/common/appError";
import { AppResponse } from "@/common/appResponse";
import { NextRequest } from "next/server";
import qs from "qs";
import { core, ZodObject } from "zod/v4";
import { THofContext } from "./type";

const convertMessage = (issues: core.$ZodIssue[]) => {
  return issues.map((i) => `${String(i.path?.["0"])}: ${i.message}`).join(", ");
};

export function withValidateFieldHandler<
  TParamsSchema extends ZodObject = never,
  TQuerySchema extends ZodObject = never,
  TBodySchema extends ZodObject = never,
  T extends THofContext = never
>(
  paramSchema: TParamsSchema | null = null,
  querySchema: TQuerySchema | null = null,
  bodySchema: TBodySchema | null = null,
  handler: (
    req: NextRequest,
    ctx: T & {
      paramParse?: THofContext["paramParse"];
      queryParse?: THofContext["queryParse"];
      bodyParse?: THofContext["bodyParse"];
    }
  ) => Promise<AppError | AppResponse>
) {
  return async (req: NextRequest, ctx: T) => {
    const url = new URL(req.url);

    let resultParam;
    if (paramSchema) {
      const params = await ctx.params;
      resultParam = paramSchema.safeParse(params);
      if (!resultParam.success) {
        return AppError.json({
          message: convertMessage(resultParam.error.issues),
        });
      }
    }

    let queryResult;
    const queryStr = qs.parse(url.search.substring(1));
    if (querySchema && Object.keys(queryStr).length) {
      queryResult = querySchema.safeParse(queryStr);
      if (!queryResult.success) {
        return AppError.json({
          message: convertMessage(queryResult.error.issues),
        });
      }
    }

    let resultBody;
    if (req.method !== "GET" && bodySchema) {
      const body = await req.json();
      resultBody = bodySchema.safeParse(body);
      if (!resultBody.success) {
        return AppError.json({
          data: convertMessage(resultBody.error.issues),
        });
      }
    }

    return handler(req, {
      ...ctx,
      bodyParse: resultBody?.data,
      paramParse: resultParam?.data,
      queryParse: queryResult?.data,
    });
  };
}
