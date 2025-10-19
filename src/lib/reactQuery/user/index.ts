import { APIEndpoint } from "@/app/api/apiEndpoint";
import { idParamsDTO as idParamUser, PatchBodyDTO as PathBodyUserDTO } from "@/app/api/user/[id]/validator";
import { DeleteUserBodyDTO, GetUserQueryDTO, PostUserCreateBodyDTO } from "@/app/api/user/validator";
import { axiosInstance } from "@/lib/axios/axiosInstance";
import { TAppResponseBody } from "@/types/api/common";
import { TGetUserListResponse } from "@/types/api/user";
import { Prisma, User } from "@prisma/client";
import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import stringify from 'fast-json-stable-stringify';
import { output } from "zod/v4";

export const userKeys = {
    all: ['user'] as const,
    lists: () => [...userKeys.all, 'list'] as const,
    list: (query: output<typeof GetUserQueryDTO>) => [...userKeys.lists(), stringify(query)] as const,
    details: () => [...userKeys.all, 'detail'] as const,
    detail: (id: string) => [...userKeys.details(), id] as const,
}

const getList = async ({ queryKey }: QueryFunctionContext) => {
    const [, , params] = queryKey as ReturnType<typeof userKeys.list>
    const data = await axiosInstance.get<TAppResponseBody<TGetUserListResponse>>(APIEndpoint.API_USER, {
        params: JSON.parse(params),
    });
    return data.data.data;
};

export function useGetUserListQuery(query: output<typeof GetUserQueryDTO>) {
    return useQuery({
        queryKey: userKeys.list(query),
        queryFn: getList,
    })
}

export const postCreateUser = async (newUser: output<typeof PostUserCreateBodyDTO>) => {
    const res = await axiosInstance.post<User>(APIEndpoint.API_USER, newUser);
    return res.data;
};


export const getUserDetail = async ({ queryKey }: QueryFunctionContext) => {
    const [, , id] = queryKey as ReturnType<typeof userKeys.detail>;
    const res = await axiosInstance.get<TAppResponseBody<Prisma.UserGetPayload<{ include: { account: true } }>>>(`${APIEndpoint.API_USER}/${id}`);
    return res.data.data;
};

export const putUser = async (variable: { id: output<typeof idParamUser>['id'], newUser: output<typeof PathBodyUserDTO> }) => {
    const { id, newUser } = variable
    const res = await axiosInstance.put<TAppResponseBody<User>>(`${APIEndpoint.API_USER}/${id}`, newUser);
    return res.data.data;
};

export const deleteUsers = async (ids: output<typeof DeleteUserBodyDTO>['ids']) => {
    const res = await axiosInstance.delete<TAppResponseBody<number>>(APIEndpoint.API_USER, {
        data: {
            ids,
        }
    })
    return res.data.data
}