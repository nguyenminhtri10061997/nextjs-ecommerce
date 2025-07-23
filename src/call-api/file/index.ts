import { APIEndpoint } from "@/app/api/apiEndpoint";
import { GetQueryDTO } from "@/app/api/file/presigned-url/validator";
import { axiosInstance } from "@/lib/axiosInstance";
import { TAppResponseBody } from "@/types/api/common";
import { PresignedPost } from "@aws-sdk/s3-presigned-post";
import axios from "axios";
import { output } from "zod/v4";

export const getPresignedUrl = async (data: output<typeof GetQueryDTO>) => {
  const res = await axiosInstance.get<TAppResponseBody<PresignedPost>>(
    APIEndpoint.API_FILE_PRESIGNED_URL,
    {
      params: data,
    }
  );
  return res.data.data;
};

export const uploadFileToS3 = async (
  presignedUrl: string,
  formData: FormData
) => {
  return axios.post(presignedUrl, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
