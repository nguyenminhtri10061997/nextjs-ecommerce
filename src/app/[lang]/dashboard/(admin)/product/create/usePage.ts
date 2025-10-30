"use client";

import { useAlertContext } from "@/components/hooks/useAlertContext";
import useFormRef from "@/components/hooks/useFormRef";
import useLoadingWhenRoutePush from "@/components/hooks/useLoadingWhenRoutePush";
import { queryClient } from "@/lib/queryClient";
import { postCreateProduct, productKeys } from "@/lib/reactQuery/product";
import { TAppResponseBody } from "@/types/api/common";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { SubmitHandler } from "react-hook-form";
import { TForm } from "../_components/product-form/useIndex";

export const usePage = () => {
  const { showAlert } = useAlertContext();
  const { push } = useLoadingWhenRoutePush();

  const mutation = useMutation({
    mutationFn: postCreateProduct,
    onSuccess: async () => {
      showAlert("create Product Success");
      await queryClient.invalidateQueries({
        queryKey: productKeys.lists(),
      });
      push("/dashboard/product");
    },
    onError: (err: AxiosError<TAppResponseBody>) => {
      const message = err.response?.data.message || err.message;
      showAlert(message, "error");
    },
  });

  const handleFormSubmit: SubmitHandler<TForm> = async (data) => {
    mutation.mutate({
      ...data,
      listImages: data.listImages.map(i => i.name!)
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
