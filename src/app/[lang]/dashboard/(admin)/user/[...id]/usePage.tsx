"use client";

import { Inputs as UserInputForm } from "@/app/[lang]/dashboard/(admin)/user/_components/UserForm/useIndex";
import { useAlertContext } from "@/hooks/useAlertContext";
import { useDashboardCtx } from "@/hooks/useDashboardCtx";
import { useLoadingCtx } from "@/hooks/useLoadingCtx";
import { queryClient } from "@/lib/queryClient";
import { getUserDetail, putUser, userKeys } from "@/lib/reactQuery/user";
import { TAppResponseBody } from "@/types/api/common";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { redirect, useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef } from "react";
import { SubmitHandler, UseFormReturn } from "react-hook-form";

export default function usePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { showAlert } = useAlertContext();
  const { breadcrumbs, setBreadCrumbs } = useDashboardCtx();
  const { setLoading } = useLoadingCtx();
  const formRef = useRef<UseFormReturn<UserInputForm>>(null);
  const query = useQuery<
    Awaited<ReturnType<typeof getUserDetail>>,
    AxiosError<TAppResponseBody>
  >({
    queryKey: userKeys.detail(id),
    queryFn: getUserDetail,
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: putUser,
    onSuccess: async () => {
      showAlert("update User success");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: userKeys.detail(id) }),
        queryClient.invalidateQueries({ queryKey: userKeys.lists() }),
      ]);
      router.push("/dashboard/user");
    },
    onError: (err: AxiosError<TAppResponseBody>) => {
      const message = err.response?.data.message || err.message;
      showAlert(message, "error");
    },
  });

  if (query.error?.response?.data.message) {
    showAlert(query.error?.response?.data.message, "error");
    redirect("/dashboard/user");
  }

  const handleSetForm = (form: UseFormReturn<UserInputForm>) => {
    formRef.current = form;
  };

  const handleFormSubmit: SubmitHandler<UserInputForm> = async (data) => {
    mutation.mutate({
      newUser: {
        fullName: data.fullName,
        type: data.type,
        account: {
          newPassword: data.password,
          username: data.username,
          roleId: data.roleId,
          isBanned: data.isBanned,
          isBlocked: data.isBlocked,
          accessTokenVersion: data.accessTokenVersion,
        },
      },
      id,
    });
  };

  const handleClickSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    formRef.current?.handleSubmit(handleFormSubmit)(e);
  };

  useEffect(() => {
    setLoading(query.isLoading)
  }, [query.isLoading, setLoading]);

  useEffect(() => {
    if (query.data?.id) {
      if (breadcrumbs.length === 3) {
        setBreadCrumbs(
          breadcrumbs
            .slice(0, breadcrumbs.length - 1)
            .concat(query.data.fullName)
        );
      }
      formRef.current?.reset({
        fullName: query.data.fullName,
        type: query.data.type,
        username: query.data.account?.username,
        roleId: query.data.account?.roleId,
        accessTokenVersion: query.data.account?.accessTokenVersion,
        isBanned: query.data.account?.isBanned,
        isBlocked: query.data.account?.isBlocked,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.data?.id, breadcrumbs.length === 3]);

  return {
    mutation,
    formRef,
    query,
    handleSetForm,
    handleClickSubmit,
  };
}
