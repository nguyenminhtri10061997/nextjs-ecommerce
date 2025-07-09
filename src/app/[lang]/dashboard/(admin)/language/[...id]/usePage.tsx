"use client";

import { useAlertContext } from "@/hooks/useAlertContext";
import { useDashboardCtx } from "@/hooks/useDashboardCtx";
import useFormRef from "@/hooks/useFormRef";
import { useLoadingCtx } from "@/hooks/useLoadingCtx";
import {
  getLanguageDetail,
  patchLanguage,
  languageKeys,
} from "@/lib/reactQuery/language";
import { TAppResponseBody } from "@/types/api/common";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { redirect, useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { SubmitHandler } from "react-hook-form";
import { TForm } from "../_components/language-form/useIndex";

export type TPermissionState = Partial<Record<string, boolean>>;
export const usePage = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showAlert } = useAlertContext();
  const { setLoading } = useLoadingCtx();
  const { breadcrumbs, setBreadCrumbs } = useDashboardCtx();

  const query = useQuery({
    queryKey: languageKeys.detail(id),
    queryFn: getLanguageDetail,
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: patchLanguage,
    onSuccess: async () => {
      showAlert("Update Language success");
      router.push("/dashboard/language");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: languageKeys.detail(id) }),
        queryClient.invalidateQueries({ queryKey: languageKeys.lists() }),
      ]);
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
      showAlert("Error Get Product Category", "error");
      setLoading(false);
      redirect("/dashboard/language");
    }
  }, [query.isError, showAlert, setLoading]);

  return {
    query,
    formRef,
    mutation,
    handleSetForm,
    handleClickSubmitForm,
  };
};
