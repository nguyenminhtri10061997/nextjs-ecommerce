"use client";

import { useAlertContext } from "@/hooks/useAlertContext";
import useFormRef from "@/hooks/useFormRef";
import { queryClient } from "@/lib/queryClient";
import { optionKeys, postCreateOption } from "@/lib/reactQuery/option";
import { TAppResponseBody } from "@/types/api/common";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { SubmitHandler } from "react-hook-form";
import { TForm } from "../_components/optionForm/useIndex";

export const usePage = () => {
  const router = useRouter();
  const { showAlert } = useAlertContext();

  const mutation = useMutation({
    mutationFn: postCreateOption,
    onSuccess: async () => {
      showAlert("create Option success");
      router.push("/dashboard/option");
      await queryClient.invalidateQueries({ queryKey: optionKeys.lists() });
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
