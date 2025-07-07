"use client";

import useFormRef from "@/hooks/useFormRef";
import { TForm } from "../_components/attributeForm/useIndex";
import { SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { attributeKeys, postCreateAttribute } from "@/lib/reactQuery/attribute";
import { useAlertContext } from "@/hooks/useAlertContext";
import { queryClient } from "@/lib/queryClient";
import { TAppResponseBody } from "@/types/api/common";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

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
    mutation.mutate(data);
  };

  const {
    formRef,
    handleSetForm,
    handleClickSubmitForm,
  } = useFormRef<TForm>({
    handleFormSubmit,
  })

  return {
    formRef,
    mutation,
    handleSetForm,
    handleClickSubmitForm,
  };
};
