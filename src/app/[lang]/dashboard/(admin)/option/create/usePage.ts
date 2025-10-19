"use client";

import { useAlertContext } from "@/hooks/useAlertContext";
import useFormRef from "@/hooks/useFormRef";
import useLoadingWhenRoutePush from "@/hooks/useLoadingWhenRoutePush";
import { queryClient } from "@/constants/queryClient";
import { optionKeys, postCreateOption } from "@/lib/reactQuery/option";
import { TAppResponseBody } from "@/types/api/common";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { SubmitHandler } from "react-hook-form";
import { TForm } from "../_components/optionForm/useIndex";

export const usePage = () => {
  const { showAlert } = useAlertContext();
  const { push } = useLoadingWhenRoutePush();

  const mutation = useMutation({
    mutationFn: postCreateOption,
    onSuccess: async () => {
      showAlert("create Option success");
      await queryClient.invalidateQueries({ queryKey: optionKeys.lists() });
      push("/dashboard/option");
    },
    onError: (err: AxiosError<TAppResponseBody>) => {
      const message = err.response?.data.message || err.message;
      showAlert(message, "error");
    },
  });

  const handleFormSubmit: SubmitHandler<TForm> = async (data) => {
    mutation.mutate({
      ...data,
      optionItems: data.optionItems.map((i, idx) => ({
        ...i,
        displayOrder: idx,
      })),
    });
  };

  const { formRef, handleSetForm, handleClickSubmitForm } = useFormRef<TForm>({
    handleFormSubmit,
  });

  return {
    formRef,
    mutation,
    handleSetForm,
    handleClickSubmitForm,
  };
};
