import { APIEndpoint } from "@/app/api/apiEndpoint";
import { IdParamsDTO, PatchBodyDTO } from "@/app/api/attribute/[id]/validator";
import { DeleteBodyDTO, GetQueryDTO, PostCreateBodyDTO } from "@/app/api/attribute/validator";
import { axiosInstance } from "@/lib/axiosInstance";
import { TAppResponseBody } from "@/types/api/common";
import { Attribute, Prisma } from "@prisma/client";
import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import stringify from "fast-json-stable-stringify";
import { output } from "zod/v4";


const API_ENDPOINT = APIEndpoint.API_ATTRIBUTE
export const attributeKeys = {
    all: ['attribute'] as const,
    lists: () => [...attributeKeys.all, 'list'] as const,
    list: (query?: output<typeof GetQueryDTO>) => [...attributeKeys.lists(), stringify(query)] as const,
    details: () => [...attributeKeys.all, 'detail'] as const,
    detail: (id: string) => [...attributeKeys.details(), id] as const,
}

const getList = async ({ queryKey }: QueryFunctionContext) => {
    const [, , params] = queryKey as ReturnType<typeof attributeKeys.list>
    const data = await axiosInstance.get<TAppResponseBody<Prisma.AttributeGetPayload<{ include: { attributeValues: true } }>[]>>(API_ENDPOINT, {
        params: JSON.parse(params),
    });
    return data.data.data;
};

export function useGetAttributeListQuery(query?: output<typeof GetQueryDTO>) {
    return useQuery({
        queryKey: attributeKeys.list(query),
        queryFn: getList,
    })
}

export const postCreateAttribute = async (body: output<typeof PostCreateBodyDTO>) => {
    const res = await axiosInstance.post<TAppResponseBody<Attribute>>(API_ENDPOINT, body);
    return res.data;
};


export const getAttributeDetail = async ({ queryKey }: QueryFunctionContext) => {
    const [, , id] = queryKey as ReturnType<typeof attributeKeys.detail>;
    const res = await axiosInstance.get<TAppResponseBody<Prisma.AttributeGetPayload<{
        include: {
            attributeValues: true
        }
    }>>>(`${API_ENDPOINT}/${id}`);
    return res.data.data;
};

export const patchAttribute = async (variable: { id: output<typeof IdParamsDTO>['id'], body: output<typeof PatchBodyDTO> }) => {
    const { id, body } = variable
    const res = await axiosInstance.patch<TAppResponseBody<Attribute>>(`${API_ENDPOINT}/${id}`, body);
    return res.data.data;
};

export const deleteAttributes = async (ids: output<typeof DeleteBodyDTO>['ids']) => {
    const res = await axiosInstance.delete<TAppResponseBody<number>>(API_ENDPOINT, {
        data: {
            ids,
        }
    })
    return res.data.data
}