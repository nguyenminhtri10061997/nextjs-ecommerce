import { APIEndpoint } from "@/app/api/apiEndpoint";
import { IdParamsDTO, PatchBodyDTO } from "@/app/api/language/[id]/validator";
import {
  DeleteBodyDTO,
  GetQueryDTO,
  PostCreateBodyDTO,
} from "@/app/api/language/validator";
import { axiosInstance } from "@/lib/axios/axiosInstance";
import { TAppResponseBody } from "@/types/api/common";
import { Language } from "@prisma/client";
import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import stringify from "fast-json-stable-stringify";
import { output } from "zod/v4";

const API_ENDPOINT = APIEndpoint.API_LANGUAGE;
export const languageKeys = {
  all: ["language"] as const,
  lists: () => [...languageKeys.all, "list"] as const,
  list: (query?: output<typeof GetQueryDTO>) =>
    [...languageKeys.lists(), stringify(query)] as const,
  details: () => [...languageKeys.all, "detail"] as const,
  detail: (id: string) => [...languageKeys.details(), id] as const,
};

const getList = async ({ queryKey }: QueryFunctionContext) => {
  const [, , params] = queryKey as ReturnType<typeof languageKeys.list>;
  const data = await axiosInstance.get<TAppResponseBody<Language[]>>(
    API_ENDPOINT,
    {
      params: JSON.parse(params),
    }
  );
  return data.data.data;
};

export function useGetLanguageListQuery(query?: output<typeof GetQueryDTO>) {
  return useQuery({
    queryKey: languageKeys.list(query),
    queryFn: getList,
  });
}

export const postCreateLanguage = async (
  body: output<typeof PostCreateBodyDTO>
) => {
  const res = await axiosInstance.post<TAppResponseBody<Language>>(
    API_ENDPOINT,
    body
  );
  return res.data;
};

export const getLanguageDetail = async ({ queryKey }: QueryFunctionContext) => {
  const [, , id] = queryKey as ReturnType<typeof languageKeys.detail>;
  const res = await axiosInstance.get<TAppResponseBody<Language>>(
    `${API_ENDPOINT}/${id}`
  );
  return res.data.data;
};

export const patchLanguage = async (variable: {
  id: output<typeof IdParamsDTO>["id"];
  body: output<typeof PatchBodyDTO>;
}) => {
  const { id, body } = variable;
  const res = await axiosInstance.patch<TAppResponseBody<Language>>(
    `${API_ENDPOINT}/${id}`,
    body
  );
  return res.data.data;
};

export const deleteLanguages = async (
  ids: output<typeof DeleteBodyDTO>["ids"]
) => {
  const res = await axiosInstance.delete<TAppResponseBody<number>>(
    API_ENDPOINT,
    {
      data: {
        ids,
      },
    }
  );
  return res.data.data;
};
