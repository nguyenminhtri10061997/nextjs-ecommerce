"use client";

import { useAlertContext } from "@/hooks/useAlertContext";
import { useDashboardCtx } from "@/hooks/useDashboardCtx";
import useFormRef from "@/hooks/useFormRef";
import { useLoadingCtx } from "@/hooks/useLoadingCtx";
import {
  getProductTagDetail,
  patchProductTag,
  productTagKeys,
} from "@/lib/reactQuery/product-tag";
import { TAppResponseBody } from "@/types/api/common";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { redirect, useParams, useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import { SubmitHandler } from "react-hook-form";
import { TForm } from "../_components/product-tag-form/useIndex";

export type TPermissionState = Partial<Record<string, boolean>>;
export const usePage = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showAlert } = useAlertContext();
  const { setLoading } = useLoadingCtx();
  const [isPending, startTransition] = useTransition();
  const { breadcrumbs, setBreadCrumbs } = useDashboardCtx();

  const query = useQuery({
    queryKey: productTagKeys.detail(id),
    queryFn: getProductTagDetail,
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: patchProductTag,
    onSuccess: async () => {
      showAlert("Update Product Tag success");
      startTransition(() => {
        router.push("/dashboard/product-tag");
        queryClient.invalidateQueries({ queryKey: productTagKeys.detail(id) });
        queryClient.invalidateQueries({ queryKey: productTagKeys.lists() });
      });
    },
    onError: (err: AxiosError<TAppResponseBody>) => {
      const message = err.response?.data.message || err.message;
      showAlert(message, "error");
    },
  });

  const handleFormSubmit: SubmitHandler<TForm> = async (data) => {
    mutation.mutate({
      id,
      body: data,
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
    setLoading(isPending);
    return () => {
      setLoading(false);
    };
  }, [isPending, setLoading]);

  useEffect(() => {
    if (query.isError) {
      showAlert("Error Get Product Tag", "error");
      setLoading(false);
      redirect("/dashboard/product-tag");
    }
  }, [query.isError, showAlert, setLoading]);

  return {
    formRef,
    mutation,
    handleSetForm,
    handleClickSubmitForm,
  };
};
