import { APIEndpoint } from "@/app/api/apiEndpoint";
import { IdParamsDTO, PatchBodyDTO } from "@/app/api/product-category/[id]/validator";
import {
  DeleteBodyDTO,
  GetQueryDTO,
  PostCreateBodyDTO,
} from "@/app/api/product-category/validator";
import { axiosInstance } from "@/lib/axiosInstance";
import { TAppResponseBody } from "@/types/api/common";
import { ProductCategory } from "@prisma/client";
import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import stringify from "fast-json-stable-stringify";
import { output } from "zod/v4";

const API_ENDPOINT = APIEndpoint.API_PRODUCT_CATEGORY;
export const productCategoryKeys = {
  all: ["productCategory"] as const,
  lists: () => [...productCategoryKeys.all, "list"] as const,
  list: (query?: output<typeof GetQueryDTO>) =>
    [...productCategoryKeys.lists(), stringify(query)] as const,
  details: () => [...productCategoryKeys.all, "detail"] as const,
  detail: (id: string) => [...productCategoryKeys.details(), id] as const,
};

const getList = async ({ queryKey }: QueryFunctionContext) => {
  const [, , params] = queryKey as ReturnType<typeof productCategoryKeys.list>;
  const data = await axiosInstance.get<TAppResponseBody<ProductCategory[]>>(
    API_ENDPOINT,
    {
      params: JSON.parse(params),
    },
  );
  return data.data.data;
};

export function useGetProductCategoryListQuery(query?: output<typeof GetQueryDTO>) {
  return useQuery({
    queryKey: productCategoryKeys.list(query),
    queryFn: getList,
  });
}

export const postCreateProductCategory = async (
  body: output<typeof PostCreateBodyDTO>
) => {
  const res = await axiosInstance.post<TAppResponseBody<ProductCategory>>(
    API_ENDPOINT,
    body,
  );
  return res.data;
};

export const getProductCategoryDetail = async ({ queryKey }: QueryFunctionContext) => {
  const [, , id] = queryKey as ReturnType<typeof productCategoryKeys.detail>;
  const res = await axiosInstance.get<TAppResponseBody<ProductCategory>>(
    `${API_ENDPOINT}/${id}`
  );
  return res.data.data;
};

export const patchProductCategory = async (variable: {
  id: output<typeof IdParamsDTO>["id"];
  body: output<typeof PatchBodyDTO>;
}) => {
  const { id, body } = variable;
  const res = await axiosInstance.patch<TAppResponseBody<ProductCategory>>(
    `${API_ENDPOINT}/${id}`,
    body
  );
  return res.data.data;
};

export const deleteProductCategories = async (
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
