"use client";

import useFormRef from "@/hooks/useFormRef";
import { TForm } from "../_components/brandForm/useIndex";
import { SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { brandKeys, postCreateBrand } from "@/lib/reactQuery/brand";
import { useAlertContext } from "@/hooks/useAlertContext";
import { queryClient } from "@/lib/queryClient";
import { TAppResponseBody } from "@/types/api/common";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const usePage = () => {
  const router = useRouter();
  const { showAlert } = useAlertContext();
  const [file, setFile] = useState<File | null>();

  const mutation = useMutation({
    mutationFn: postCreateBrand,
    onSuccess: async () => {
      showAlert("create Brand success");
      router.push("/dashboard/brand");
      await queryClient.invalidateQueries({ queryKey: brandKeys.lists() });
    },
    onError: (err: AxiosError<TAppResponseBody>) => {
      const message = err.response?.data.message || err.message;
      showAlert(message, "error");
    },
  });

  const handleFormSubmit: SubmitHandler<TForm> = async (data) => {
    const formData = new FormData()
    if (file) {
      formData.append("logoImgFile", file)
    }

    (Object.keys(data) as Array<keyof typeof data>).forEach((key) => {
      formData.append(key, data[key] as string);
    });

    mutation.mutate(formData);
  };

  const { formRef, handleSetForm, handleClickSubmitForm } = useFormRef<TForm>({
    handleFormSubmit,
  });

  return {
    formRef,
    mutation,
    file,
    handleSetForm,
    handleClickSubmitForm,
    setFile
  };
};
