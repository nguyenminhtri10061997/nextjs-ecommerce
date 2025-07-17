import { APIEndpoint } from "@/app/api/apiEndpoint";
import { IdParamsDTO, PatchBodyDTO } from "@/app/api/option/[id]/validator";
import {
  DeleteBodyDTO,
  GetQueryDTO,
  PostCreateBodyDTO,
} from "@/app/api/option/validator";
import { axiosInstance } from "@/lib/axiosInstance";
import { TAppResponseBody } from "@/types/api/common";
import { Option, Prisma } from "@prisma/client";
import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import stringify from "fast-json-stable-stringify";
import { output } from "zod/v4";

const API_ENDPOINT = APIEndpoint.API_OPTION;
export const optionKeys = {
  all: ["option"] as const,
  lists: () => [...optionKeys.all, "list"] as const,
  list: (query?: output<typeof GetQueryDTO>) =>
    [...optionKeys.lists(), stringify(query)] as const,
  details: () => [...optionKeys.all, "detail"] as const,
  detail: (id: string) => [...optionKeys.details(), id] as const,
};

const getList = async ({ queryKey }: QueryFunctionContext) => {
  const [, , params] = queryKey as ReturnType<typeof optionKeys.list>;
  const data = await axiosInstance.get<TAppResponseBody<Prisma.OptionGetPayload<{ include: { optionItems: true } }>[]>>(
    API_ENDPOINT,
    {
      params: JSON.parse(params),
    }
  );
  return data.data.data;
};

export function useGetOptionListQuery(query?: output<typeof GetQueryDTO>) {
  return useQuery({
    queryKey: optionKeys.list(query),
    queryFn: getList,
  });
}

export const postCreateOption = async (
  body: output<typeof PostCreateBodyDTO>
) => {
  const res = await axiosInstance.post<TAppResponseBody<Option>>(
    API_ENDPOINT,
    body
  );
  return res.data;
};

export const getOptionDetail = async ({ queryKey }: QueryFunctionContext) => {
  const [, , id] = queryKey as ReturnType<typeof optionKeys.detail>;
  const res = await axiosInstance.get<
    TAppResponseBody<
      Prisma.OptionGetPayload<{
        include: {
          optionItems: true;
        };
      }>
    >
  >(`${API_ENDPOINT}/${id}`);
  return res.data.data;
};

export const patchOption = async (variable: {
  id: output<typeof IdParamsDTO>["id"];
  body: output<typeof PatchBodyDTO>;
}) => {
  const { id, body } = variable;
  const res = await axiosInstance.patch<TAppResponseBody<Option>>(
    `${API_ENDPOINT}/${id}`,
    body
  );
  return res.data.data;
};

export const deleteOptions = async (
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
