"use client";

import { Inputs as InputUserForm, Inputs as UserInputForm } from "@/app/[lang]/dashboard/(admin)/user/_components/UserForm/useIndex";
import { useAlertContext } from "@/hooks/useAlertContext";
import { roleKeys } from "@/lib/reactQuery/role";
import { postCreateUser } from "@/lib/reactQuery/user";
import { TAppResponseBody } from "@/types/api/common";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef } from "react";
import { SubmitHandler, UseFormReturn } from "react-hook-form";

export const usePage = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showAlert } = useAlertContext();
  const formRef = useRef<UseFormReturn<UserInputForm>>(null);

  const mutation = useMutation({
    mutationFn: postCreateUser,
    onSuccess: async () => {
      showAlert("create User success");
      await queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
      router.push("/dashboard/user");
    },
    onError: (err: AxiosError<TAppResponseBody>) => {
      const message = err.response?.data.message || err.message;
      showAlert(message, "error");
    },
  });

  const handleFormSubmit: SubmitHandler<InputUserForm> = async (data) => {
    mutation.mutate({
      fullName: data.fullName,
      type: data.type,
      account: {
        password: data.password,
        username: data.username,
        roleId: data.roleId,
        isBanned: data.isBanned,
        isBlocked: data.isBlocked,
      },
    });
  };

  const handleClickSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    formRef.current?.handleSubmit(handleFormSubmit)(e);
  };

  const handleSetForm = (form: UseFormReturn<UserInputForm>) => {
    formRef.current = form;
  };

  useEffect(() => {
    formRef.current?.reset({
      accessTokenVersion: 1,
      type: "STAFF",
    });
  }, []);

  return {
    formRef,
    mutation,
    handleClickSubmit,
    handleSetForm,
    handleFormSubmit,
  };
};
