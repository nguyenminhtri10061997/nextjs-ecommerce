"use client";

import { useAlertContext } from "@/hooks/useAlertContext";
import useFormRef from "@/hooks/useFormRef";
import useLoadingWhenRoutePush from "@/hooks/useLoadingWhenRoutePush";
import { queryClient } from "@/constants/queryClient";
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
      skus: data.skus.map((sku) => ({ ...sku, image: sku.image.file })),
      listImages: data.listImages.map((i) => i.file).filter(Boolean) as File[],
      mainImage: data.mainImage.file!,
      attributes: data.attributes.map((i, idx) => ({
        id: i.id,
        name: i.name,
        slug: i.slug,
        status: i.status,
        displayOrder: idx,
        type: i.type,
        attributeValues: i.attributeValues.map((v, idxV) => ({
          id: i.id,
          name: v.name,
          slug: v.slug,
          image: v.image.file,
          displayOrder: idxV,
          status: v.status,
        })),
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
