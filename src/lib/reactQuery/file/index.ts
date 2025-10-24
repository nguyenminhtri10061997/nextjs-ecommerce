import { APIEndpoint } from "@/app/api/apiEndpoint";
import { GetQueryDTO as GetPresignedUrl } from "@/app/api/file/get-signed-url/validator";
import { GetQueryDTO as GetPresignedPostQueryDTO } from "@/app/api/file/presigned-post/validator";
import { axiosInstance } from "@/lib/axiosInstance";
import { TAppResponseBody } from "@/types/api/common";
import { PresignedPost } from "@aws-sdk/s3-presigned-post";
import axios from "axios";
import { output } from "zod/v4";

export const presignedPost = async (
  data: output<typeof GetPresignedPostQueryDTO>
) => {
  const res = await axiosInstance.get<TAppResponseBody<PresignedPost>>(
    `${APIEndpoint.API_FILE}/presigned-post`,
    {
      params: data,
    }
  );
  return res.data.data;
};

export const getSignedUrl = async (data: output<typeof GetPresignedUrl>) => {
  const res = await axiosInstance.get<
    TAppResponseBody<{
      signedUrl: string
      key: string
    }>
  >(`${APIEndpoint.API_FILE}/get-signed-url`, {
    params: data,
  });
  return res.data.data;
};

export const uploadFileToS3ByPresignedPost = async (
  presignedUrl: string,
  formData: FormData
) => {
  return axios.post(presignedUrl, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const uploadFileToS3ByGetSignedUrl = async (
  presignedUrl: string,
  file: File,
  checksumSHA256: string
) => {
  return axios.put(presignedUrl, file, {
    headers: {
      "Content-Type": file.type,
      "x-amz-checksum-sha256": checksumSHA256,
    },
  });
};
