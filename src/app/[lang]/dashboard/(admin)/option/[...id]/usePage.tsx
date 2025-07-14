"use client";

import { useAlertContext } from "@/hooks/useAlertContext";
import { useDashboardCtx } from "@/hooks/useDashboardCtx";
import useFormRef from "@/hooks/useFormRef";
import {
  optionKeys,
  getOptionDetail,
  patchOption,
} from "@/lib/reactQuery/option";
import { TAppResponseBody } from "@/types/api/common";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { SubmitHandler } from "react-hook-form";
import { TForm } from "../_components/optionForm/useIndex";
import { useLoadingCtx } from "@/hooks/useLoadingCtx";
import { v4 } from "uuid";

export type TPermissionState = Partial<Record<string, boolean>>;
export const usePage = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showAlert } = useAlertContext();
  const { breadcrumbs, setBreadCrumbs } = useDashboardCtx();
  const { setLoading } = useLoadingCtx();

  const query = useQuery({
    queryKey: optionKeys.detail(id),
    queryFn: getOptionDetail,
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: patchOption,
    onSuccess: async () => {
      showAlert("Update Option success");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: optionKeys.detail(id) }),
        queryClient.invalidateQueries({ queryKey: optionKeys.lists() }),
      ]);
      router.push("/dashboard/option");
    },
    onError: (err: AxiosError<TAppResponseBody>) => {
      const message = err.response?.data.message || err.message;
      showAlert(message, "error");
    },
  });

  const handleFormSubmit: SubmitHandler<TForm> = async ({
    name,
    slug,
    optionItems,
  }) => {
    mutation.mutate({
      id,
      body: {
        name,
        slug,
        optionItems: optionItems.map((i, idx) => ({
          ...i,
          displayOrder: idx,
        })),
      },
    });
  };

  const { formRef, handleClickSubmitForm, handleSetForm } = useFormRef<TForm>({
    handleFormSubmit,
  });

  useEffect(() => {
    if (query.data?.id) {
      const { name, slug, optionItems } = query.data;
      if (breadcrumbs.length === 3) {
        setBreadCrumbs(
          breadcrumbs.slice(0, breadcrumbs.length - 1).concat(query.data.name)
        );
      }
      formRef.current?.reset({
        name,
        slug,
        optionItems: optionItems.map((i) => ({
          ...i,
          idDnD: v4(),
        })),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.data?.id, breadcrumbs.length === 3]);

  useEffect(() => {
    setLoading(query.isLoading);
  }, [query.isLoading, setLoading]);

  return {
    formRef,
    mutation,
    handleSetForm,
    handleClickSubmitForm,
  };
};
