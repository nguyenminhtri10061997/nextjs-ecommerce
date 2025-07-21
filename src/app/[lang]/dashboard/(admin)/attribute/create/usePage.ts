"use client";

import { useAlertContext } from "@/hooks/useAlertContext";
import useFormRef from "@/hooks/useFormRef";
import { queryClient } from "@/lib/queryClient";
import { attributeKeys, postCreateAttribute } from "@/lib/reactQuery/attribute";
import { TAppResponseBody } from "@/types/api/common";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { SubmitHandler } from "react-hook-form";
import { TForm } from "../_components/attributeForm/useIndex";

export const usePage = () => {
  const router = useRouter();
  const { showAlert } = useAlertContext();

  const mutation = useMutation({
    mutationFn: postCreateAttribute,
    onSuccess: async () => {
      showAlert("create Attribute success");
      await queryClient.invalidateQueries({ queryKey: attributeKeys.lists() });
      router.push("/dashboard/attribute");
    },
    onError: (err: AxiosError<TAppResponseBody>) => {
      const message = err.response?.data.message || err.message;
      showAlert(message, "error");
    },
  });

  const handleFormSubmit: SubmitHandler<TForm> = async (data) => {
    if (!data.attributeValues.length) {
      showAlert("Please add at least one Attribute Value", "error")
      return
    }
    mutation.mutate({
      ...data,
      attributeValues: data.attributeValues.map((i, idx) => ({
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
