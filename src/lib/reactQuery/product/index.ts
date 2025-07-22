import { APIEndpoint } from "@/app/api/apiEndpoint";
import {
  IdParamsDTO,
  PatchUpdateBodyDTO,
} from "@/app/api/product/[id]/validator";
import {
  DeleteBodyDTO,
  GetQueryDTO,
  PostCreateBodyDTO,
} from "@/app/api/product/validator";
import { axiosInstance } from "@/lib/axiosInstance";
import { TFormFile } from "@/types";
import { TAppResponseBody, TPaginationResponse } from "@/types/api/common";
import { Product } from "@prisma/client";
import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import stringify from "fast-json-stable-stringify";
import { output } from "zod/v4";

const API_ENDPOINT = APIEndpoint.API_PRODUCT;
export const productKeys = {
  all: ["product"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (query?: output<typeof GetQueryDTO>) =>
    [...productKeys.lists(), stringify(query)] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
};

const getList = async ({ queryKey }: QueryFunctionContext) => {
  const [, , params] = queryKey as ReturnType<typeof productKeys.list>;
  const data = await axiosInstance.get<
    TAppResponseBody<{ data: Product[]; pagination: TPaginationResponse }>
  >(API_ENDPOINT, {
    params: JSON.parse(params),
  });
  return data.data.data;
};

export function useGetProductListQuery(query?: output<typeof GetQueryDTO>) {
  return useQuery({
    queryKey: productKeys.list(query),
    queryFn: getList,
  });
}

const convertCreateBodyToFormData = (
  body: output<typeof PostCreateBodyDTO>
) => {
  const formData = new FormData();

  (Object.keys(body) as (keyof typeof body)[]).forEach((key) => {
    let value
    switch(key) {
      case 'listImages':
        value = body[key] as TFormFile[]
        value.forEach(file => {
          formData.append('listImages[]', file.file as File)
        })
        break

      case 'attributes':
        value = body[key] as output<typeof PostCreateBodyDTO>['attributes']
        value.forEach(at => {
          formData.append('listImages', file.file as File)
        })
        break
      default:
        value = body[key];
        formData.append(key, value as string | File);
      break
    }
  });

  return formData;
};

export const postCreateProduct = async (
  body: output<typeof PostCreateBodyDTO>
) => {
  const res = await axiosInstance.post<TAppResponseBody<Product>>(
    API_ENDPOINT,
    body
  );
  return res.data;
};

export const getProductDetail = async ({ queryKey }: QueryFunctionContext) => {
  const [, , id] = queryKey as ReturnType<typeof productKeys.detail>;
  const res = await axiosInstance.get<TAppResponseBody<Product>>(
    `${API_ENDPOINT}/${id}`
  );
  return res.data.data;
};

export const patchProduct = async (variable: {
  id: output<typeof IdParamsDTO>["id"];
  body: output<typeof PatchUpdateBodyDTO>;
}) => {
  const { id, body } = variable;
  const res = await axiosInstance.patch<TAppResponseBody<Product>>(
    `${API_ENDPOINT}/${id}`,
    body
  );
  return res.data.data;
};

export const deleteProducts = async (
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
