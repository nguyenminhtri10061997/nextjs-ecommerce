import { APIEndpoint } from "@/app/api/apiEndpoint";
import { IdParamsDTO, PatchBodyDTO } from "@/app/api/brand/[id]/validator";
import {
    DeleteBodyDTO,
    GetQueryDTO,
    PostCreateBodyDTO,
} from "@/app/api/brand/validator";
import { axiosInstance } from "@/lib/axiosInstance";
import { TAppResponseBody } from "@/types/api/common";
import { Brand } from "@prisma/client";
import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import stringify from "fast-json-stable-stringify";
import { output } from "zod/v4";

const API_ENDPOINT = APIEndpoint.API_BRAND;
export const brandKeys = {
  all: ["brand"] as const,
  lists: () => [...brandKeys.all, "list"] as const,
  list: (query?: output<typeof GetQueryDTO>) =>
    [...brandKeys.lists(), stringify(query)] as const,
  details: () => [...brandKeys.all, "detail"] as const,
  detail: (id: string) => [...brandKeys.details(), id] as const,
};

const getList = async ({ queryKey }: QueryFunctionContext) => {
  const [, , params] = queryKey as ReturnType<typeof brandKeys.list>;
  const data = await axiosInstance.get<TAppResponseBody<Brand[]>>(
    API_ENDPOINT,
    {
      params: JSON.parse(params),
    }
  );
  return data.data.data;
};

export function useGetBrandListQuery(query?: output<typeof GetQueryDTO>) {
  return useQuery({
    queryKey: brandKeys.list(query),
    queryFn: getList,
  });
}

export const postCreateBrand = async (
  body: output<typeof PostCreateBodyDTO>
) => {
  const res = await axiosInstance.post<TAppResponseBody<Brand>>(
    API_ENDPOINT,
    body
  );
  return res.data;
};

export const getBrandDetail = async ({ queryKey }: QueryFunctionContext) => {
  const [, , id] = queryKey as ReturnType<typeof brandKeys.detail>;
  const res = await axiosInstance.get<TAppResponseBody<Brand>>(
    `${API_ENDPOINT}/${id}`
  );
  return res.data.data;
};

export const patchBrand = async (variable: {
  id: output<typeof IdParamsDTO>["id"];
  body: output<typeof PatchBodyDTO>;
}) => {
  const { id, body } = variable;
  const res = await axiosInstance.patch<TAppResponseBody<Brand>>(
    `${API_ENDPOINT}/${id}`,
    body
  );
  return res.data.data;
};

export const deleteBrands = async (
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
