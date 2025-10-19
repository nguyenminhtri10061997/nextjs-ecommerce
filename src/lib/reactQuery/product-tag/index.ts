import { APIEndpoint } from "@/app/api/apiEndpoint";
import { IdParamsDTO, PatchBodyDTO } from "@/app/api/product-tag/[id]/validator";
import {
  DeleteBodyDTO,
  GetQueryDTO,
  PostCreateBodyDTO,
} from "@/app/api/product-tag/validator";
import { axiosInstance } from "@/lib/axios/axiosInstance";
import { TAppResponseBody } from "@/types/api/common";
import { ProductTag } from "@prisma/client";
import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import stringify from "fast-json-stable-stringify";
import { output } from "zod/v4";

const API_ENDPOINT = APIEndpoint.API_PRODUCT_TAG;
export const productTagKeys = {
  all: ["productTag"] as const,
  lists: () => [...productTagKeys.all, "list"] as const,
  list: (query?: output<typeof GetQueryDTO>) =>
    [...productTagKeys.lists(), stringify(query)] as const,
  details: () => [...productTagKeys.all, "detail"] as const,
  detail: (id: string) => [...productTagKeys.details(), id] as const,
};

const getList = async ({ queryKey }: QueryFunctionContext) => {
  const [, , params] = queryKey as ReturnType<typeof productTagKeys.list>;
  const data = await axiosInstance.get<TAppResponseBody<ProductTag[]>>(
    API_ENDPOINT,
    {
      params: JSON.parse(params),
    }
  );
  return data.data.data;
};

export function useGetProductTagListQuery(query?: output<typeof GetQueryDTO>) {
  return useQuery({
    queryKey: productTagKeys.list(query),
    queryFn: getList,
  });
}

export const postCreateProductTag = async (
  body: output<typeof PostCreateBodyDTO>
) => {
  const res = await axiosInstance.post<TAppResponseBody<ProductTag>>(
    API_ENDPOINT,
    body
  );
  return res.data;
};

export const getProductTagDetail = async ({ queryKey }: QueryFunctionContext) => {
  const [, , id] = queryKey as ReturnType<typeof productTagKeys.detail>;
  const res = await axiosInstance.get<TAppResponseBody<ProductTag>>(
    `${API_ENDPOINT}/${id}`
  );
  return res.data.data;
};

export const patchProductTag = async (variable: {
  id: output<typeof IdParamsDTO>["id"];
  body: output<typeof PatchBodyDTO>;
}) => {
  const { id, body } = variable;
  const res = await axiosInstance.patch<TAppResponseBody<ProductTag>>(
    `${API_ENDPOINT}/${id}`,
    body
  );
  return res.data.data;
};

export const deleteProductTags = async (
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
