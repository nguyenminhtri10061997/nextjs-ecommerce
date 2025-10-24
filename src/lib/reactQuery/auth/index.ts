import { APIEndpoint } from "@/app/api/apiEndpoint";
import { PostAccountLoginBodyDTO } from "@/app/api/auth/login/validator";
import axios from "axios";
import { output } from "zod/v4";

export const postLogin = (data: output<typeof PostAccountLoginBodyDTO>) => {
  return axios.post(APIEndpoint.AUTH.POST_LOG_IN, {
    username: data.username,
    password: data.password,
  });
};

export const postLogout = () => {
  return axios.post(APIEndpoint.AUTH.POST_LOG_OUT);
};
