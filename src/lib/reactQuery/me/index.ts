import { APIEndpoint } from "@/app/api/apiEndpoint";
import { axiosInstance } from "@/lib/axios/axiosInstance";
import { TPostMeResponse } from "@/types/api/auth/meResponse";
import { TAppResponseBody } from "@/types/api/common";
import { useQuery } from "@tanstack/react-query";

const meKeys = {
    me: ['me'] as const
}

const fetchMe = async () => {
    const data = await axiosInstance.get<TAppResponseBody<TPostMeResponse>>(APIEndpoint.POST_ME);
    return data.data.data;
};

export function useMeQuery() {
    return useQuery({
        queryKey: meKeys.me,
        queryFn: fetchMe,
        staleTime: Infinity,
    })
}