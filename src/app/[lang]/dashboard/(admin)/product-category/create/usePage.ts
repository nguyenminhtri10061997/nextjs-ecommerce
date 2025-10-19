"use client";

import { useAlertContext } from "@/hooks/useAlertContext";
import useFormRef from "@/hooks/useFormRef";
import useLoadingWhenRoutePush from "@/hooks/useLoadingWhenRoutePush";
import { queryClient } from "@/constants/queryClient";
import {
  postCreateProductCategory,
  productCategoryKeys,
} from "@/lib/reactQuery/product-category";
import { TAppResponseBody } from "@/types/api/common";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { SubmitHandler } from "react-hook-form";
import { TForm } from "../_components/product-category-form/useIndex";

export const usePage = () => {
  const { showAlert } = useAlertContext();
  const { push } = useLoadingWhenRoutePush();

  const mutation = useMutation({
    mutationFn: postCreateProductCategory,
    onSuccess: async () => {
      showAlert("create Brand success");
      await queryClient.invalidateQueries({
        queryKey: productCategoryKeys.lists(),
      });
      push("/dashboard/product-category");
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
