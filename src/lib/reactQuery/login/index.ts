import { APIEndpoint } from "@/app/api/apiEndpoint";
import { PostAccountLoginBodyDTO } from "@/app/api/auth/login/validator";
import { axiosInstance } from "@/lib/axios/axiosInstance";
import { TAppResponseBody } from "@/types/api/common";
import { output } from "zod/v4";

export const postLogin = async (
  body: output<typeof PostAccountLoginBodyDTO>
) => {
  const res = await axiosInstance.post<TAppResponseBody>(
    APIEndpoint.POST_LOG_IN,
    body
  );
  return res.data;
};
