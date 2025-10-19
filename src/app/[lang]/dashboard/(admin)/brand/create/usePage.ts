"use client";

import { useAlertContext } from "@/hooks/useAlertContext";
import useFormRef from "@/hooks/useFormRef";
import useLoadingWhenRoutePush from "@/hooks/useLoadingWhenRoutePush";
import { queryClient } from "@/constants/queryClient";
import { brandKeys, postCreateBrand } from "@/lib/reactQuery/brand";
import { TAppResponseBody } from "@/types/api/common";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import { SubmitHandler } from "react-hook-form";
import { TForm } from "../_components/brandForm/useIndex";

export const usePage = () => {
  const { showAlert } = useAlertContext();
  const [file, setFile] = useState<File | null>();
  const { push } = useLoadingWhenRoutePush();

  const mutation = useMutation({
    mutationFn: postCreateBrand,
    onSuccess: async () => {
      showAlert("create Brand success");
      await queryClient.invalidateQueries({ queryKey: brandKeys.lists() });
      push("/dashboard/brand");
    },
    onError: (err: AxiosError<TAppResponseBody>) => {
      const message = err.response?.data.message || err.message;
      showAlert(message, "error");
    },
  });

  const handleFormSubmit: SubmitHandler<TForm> = async (data) => {
    mutation.mutate(data);
  };

  const { formRef, handleSetForm, handleClickSubmitForm } = useFormRef<TForm>({
    handleFormSubmit,
  });

  const handleChangeFile = (file: File) => {
    setFile(file);
  };

  const handleDeleteFile = () => {
    setFile(null);
  };

  return {
    formRef,
    mutation,
    file,
    handleSetForm,
    handleClickSubmitForm,
    handleChangeFile,
    handleDeleteFile,
  };
};
