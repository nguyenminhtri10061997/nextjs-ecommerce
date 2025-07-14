"use client";

import { useAlertContext } from "@/hooks/useAlertContext";
import useFormRef from "@/hooks/useFormRef";
import { queryClient } from "@/lib/queryClient";
import { postCreateProduct, productKeys } from "@/lib/reactQuery/product";
import { TAppResponseBody } from "@/types/api/common";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { SubmitHandler } from "react-hook-form";
import { TForm } from "../_components/product-form/useIndex";

export const usePage = () => {
  const router = useRouter();
  const { showAlert } = useAlertContext();

  const mutation = useMutation({
    mutationFn: postCreateProduct,
    onSuccess: async () => {
      showAlert("create Product Success");
      router.push("/dashboard/product");
      await queryClient.invalidateQueries({
        queryKey: productKeys.lists(),
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
