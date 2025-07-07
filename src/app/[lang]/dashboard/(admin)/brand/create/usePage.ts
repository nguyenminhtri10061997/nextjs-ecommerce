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

export const usePage = () => {
  const router = useRouter();
  const { showAlert } = useAlertContext();

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
    mutation.mutate(data);
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
