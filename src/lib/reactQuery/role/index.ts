import { APIEndpoint } from "@/app/api/apiEndpoint";
import { idParamsDTO as idParamsRoleDTO, PatchBodyDTO as PatchRoleBodyDTO } from "@/app/api/role/[id]/validator";
import { DeleteBodyDTO as DeleteRoleBodyDTO, GetQueryDTO as GetRoleQueryDTO, PostCreateBodyDTO as PostCreateRoleBodyDTO } from "@/app/api/role/validator";
import { axiosInstance } from "@/lib/axiosInstance";
import { TAppResponseBody } from "@/types/api/common";
import { TGetRoleListResponse } from "@/types/api/role";
import { Prisma, Role } from "@prisma/client";
import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import stringify from "fast-json-stable-stringify";
import { output } from "zod/v4";


const API_ENDPOINT = APIEndpoint.API_ROLE
export const roleKeys = {
    all: ['role'] as const,
    lists: () => [...roleKeys.all, 'list'] as const,
    list: (query?: output<typeof GetRoleQueryDTO>) => [...roleKeys.lists(), stringify(query)] as const,
    details: () => [...roleKeys.all, 'detail'] as const,
    detail: (id: string) => [...roleKeys.details(), id] as const,
}

const getList = async ({ queryKey }: QueryFunctionContext) => {
    const [, , params] = queryKey as ReturnType<typeof roleKeys.list>
    const data = await axiosInstance.get<TAppResponseBody<TGetRoleListResponse>>(API_ENDPOINT, {
        params: JSON.parse(params),
    });
    return data.data.data;
};

export function useGetRoleListQuery(query?: output<typeof GetRoleQueryDTO>) {
    return useQuery({
        queryKey: roleKeys.list(query),
        queryFn: getList,
    })
}

export const postCreateRole = async (body: output<typeof PostCreateRoleBodyDTO>) => {
    const res = await axiosInstance.post<TAppResponseBody<Role>>(API_ENDPOINT, body);
    return res.data;
};


export const getRoleDetail = async ({ queryKey }: QueryFunctionContext) => {
    const [, , id] = queryKey as ReturnType<typeof roleKeys.detail>;
    const res = await axiosInstance.get<TAppResponseBody<Prisma.RoleGetPayload<{
        include: {
            permissions: {
                select: {
                    id: true,
                    action: true,
                    resource: true,
                }
            },
        }
    }>>>(`${API_ENDPOINT}/${id}`);
    return res.data.data;
};

export const patchRole = async (variable: { id: output<typeof idParamsRoleDTO>['id'], body: output<typeof PatchRoleBodyDTO> }) => {
    const { id, body } = variable
    const res = await axiosInstance.patch<TAppResponseBody<Role>>(`${API_ENDPOINT}/${id}`, body);
    return res.data.data;
};

export const deleteRoles = async (ids: output<typeof DeleteRoleBodyDTO>['ids']) => {
    const res = await axiosInstance.delete<TAppResponseBody<number>>(API_ENDPOINT, {
        data: {
            ids,
        }
    })
    return res.data.data
}