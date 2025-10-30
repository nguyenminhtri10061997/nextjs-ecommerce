"use client";

import { useAlertContext } from "@/components/hooks/useAlertContext";
import { useDashboardCtx } from "@/components/hooks/useDashboardCtx";
import useFormRef from "@/components/hooks/useFormRef";
import { useLoadingCtx } from "@/components/hooks/useLoadingCtx";
import useLoadingWhenRoutePush from "@/components/hooks/useLoadingWhenRoutePush";
import {
  getLanguageDetail,
  languageKeys,
  patchLanguage,
} from "@/lib/reactQuery/language";
import { TAppResponseBody } from "@/types/api/common";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { redirect, useParams } from "next/navigation";
import { useEffect } from "react";
import { SubmitHandler } from "react-hook-form";
import { TForm } from "../_components/language-form/useIndex";

export type TPermissionState = Partial<Record<string, boolean>>;
export const usePage = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { showAlert } = useAlertContext();
  const { setLoading } = useLoadingCtx();
  const { breadcrumbs, setBreadCrumbs } = useDashboardCtx();
  const { push } = useLoadingWhenRoutePush();

  const query = useQuery({
    queryKey: languageKeys.detail(id),
    queryFn: getLanguageDetail,
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: patchLanguage,
    onSuccess: async () => {
      showAlert("Update Language success");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: languageKeys.detail(id) }),
        queryClient.invalidateQueries({ queryKey: languageKeys.lists() }),
      ]);
      push("/dashboard/language");
    },
    onError: (err: AxiosError<TAppResponseBody>) => {
      const message = err.response?.data.message || err.message;
      showAlert(message, "error");
    },
  });

  const handleFormSubmit: SubmitHandler<TForm> = async (data) => {
    mutation.mutate({
      id,
      body: {
        ...data,
        isDefault: data.isDefault || false,
      },
    });
  };

  const { formRef, handleClickSubmitForm, handleSetForm } = useFormRef<TForm>({
    handleFormSubmit,
  });

  useEffect(() => {
    if (query.data?.id) {
      if (breadcrumbs.length === 3) {
        setBreadCrumbs(
          breadcrumbs.slice(0, breadcrumbs.length - 1).concat(query.data.name)
        );
      }
      formRef.current?.reset(query.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.data?.id, breadcrumbs.length === 3]);

  useEffect(() => {
    setLoading(query.isLoading);
  }, [query.isLoading, setLoading]);

  useEffect(() => {
    if (query.isError) {
      showAlert("Error Get Language", "error");
      setLoading(false);
      redirect("/dashboard/language");
    }
  }, [query.isError, showAlert, setLoading]);

  return {
    formRef,
    mutation,
    handleSetForm,
    handleClickSubmitForm,
  };
};
