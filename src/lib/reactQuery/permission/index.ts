import { APIEndpoint } from "@/app/api/apiEndpoint";
import { GetQueryDTO } from "@/app/api/permission/validator";
import { axiosInstance } from "@/lib/axios/axiosInstance";
import { TAppResponseBody } from "@/types/api/common";
import { TGetPermissionListResponse } from "@/types/api/permission";

import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import stringify from 'fast-json-stable-stringify';
import { output } from "zod/v4";

const endPoint = APIEndpoint.API_PERMISSION

export const permissionKeys = {
    all: ['permission'] as const,
    lists: () => [...permissionKeys.all, 'list'] as const,
    list: (query?: output<typeof GetQueryDTO>) => [...permissionKeys.lists(), stringify(query)] as const,
}

const getList = async ({ queryKey }: QueryFunctionContext) => {
    const [, , params] = queryKey as ReturnType<typeof permissionKeys.list>
    const data = await axiosInstance.get<TAppResponseBody<TGetPermissionListResponse>>(endPoint, {
        params: JSON.parse(params),
    });
    return data.data.data;
};

export function useGetPermissionList(query?: output<typeof GetQueryDTO>) {
    return useQuery({
        queryKey: permissionKeys.list(query),
        queryFn: getList,
        staleTime: Infinity,
    })
}