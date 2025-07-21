"use client";

import { useAlertContext } from "@/hooks/useAlertContext";
import useLoadingWhenRoutePush from "@/hooks/useLoadingWhenRoutePush";
import { postCreateRole, roleKeys } from "@/lib/reactQuery/role";
import { TAppResponseBody } from "@/types/api/common";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { FormEvent, useRef, useState } from "react";
import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { Inputs as RoleInputs } from "../_components/RoleForm/useIndex";

export type TPermissionState = Partial<Record<string, boolean>>;
export const usePage = () => {
  const [permissionSelected, setPermissionSelected] =
    useState<TPermissionState>({});
  const queryClient = useQueryClient();
  const { showAlert } = useAlertContext();
  const formRef = useRef<UseFormReturn<RoleInputs>>(null);
  const { push } = useLoadingWhenRoutePush();

  const mutation = useMutation({
    mutationFn: postCreateRole,
    onSuccess: async () => {
      showAlert("create Role success");
      await queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
      push("/dashboard/role");
    },
    onError: (err: AxiosError<TAppResponseBody>) => {
      const message = err.response?.data.message || err.message;
      showAlert(message, "error");
    },
  });

  const handleFormSubmit: SubmitHandler<RoleInputs> = async ({
    description,
    name,
  }) => {
    mutation.mutate({
      name,
      permissionIds: Object.keys(permissionSelected),
      description: description || undefined,
    });
  };

  const handleClickSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    formRef.current?.handleSubmit(handleFormSubmit)(e);
  };

  const handleSetForm = (form: UseFormReturn<RoleInputs>) => {
    formRef.current = form;
  };

  const handleChangeCheckbox =
    (id: string) =>
    (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      const clone = { ...permissionSelected };
      if (!checked) {
        delete clone[id];
      } else {
        clone[id] = true;
      }
      setPermissionSelected({
        ...clone,
      });
    };

  return {
    formRef,
    mutation,
    permissionSelected,
    handleClickSubmit,
    handleSetForm,
    handleFormSubmit,
    handleChangeCheckbox,
  };
};
