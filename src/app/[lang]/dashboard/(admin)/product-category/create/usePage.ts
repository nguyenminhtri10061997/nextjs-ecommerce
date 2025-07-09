"use client";

import { useAlertContext } from "@/hooks/useAlertContext";
import useFormRef from "@/hooks/useFormRef";
import { queryClient } from "@/lib/queryClient";
import {
  postCreateProductCategory,
  productCategoryKeys,
} from "@/lib/reactQuery/product-category";
import { TAppResponseBody } from "@/types/api/common";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { SubmitHandler } from "react-hook-form";
import { TForm } from "../_components/product-category-form/useIndex";

export const usePage = () => {
  const router = useRouter();
  const { showAlert } = useAlertContext();

  const mutation = useMutation({
    mutationFn: postCreateProductCategory,
    onSuccess: async () => {
      showAlert("create Brand success");
      router.push("/dashboard/product-category");
      await queryClient.invalidateQueries({
        queryKey: productCategoryKeys.lists(),
      });
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
