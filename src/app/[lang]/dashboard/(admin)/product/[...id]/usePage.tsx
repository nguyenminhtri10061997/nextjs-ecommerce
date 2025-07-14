"use client";

import { useAlertContext } from "@/hooks/useAlertContext";
import { useDashboardCtx } from "@/hooks/useDashboardCtx";
import useFormRef from "@/hooks/useFormRef";
import { useLoadingCtx } from "@/hooks/useLoadingCtx";
import {
  getProductDetail,
  patchProduct,
  productKeys,
} from "@/lib/reactQuery/product";
import { TAppResponseBody } from "@/types/api/common";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { redirect, useParams, useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import { SubmitHandler } from "react-hook-form";
import { TForm } from "../_components/product-form/useIndex";

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
    queryKey: productKeys.detail(id),
    queryFn: getProductDetail,
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: patchProduct,
    onSuccess: async () => {
      showAlert("Update Product Tag success");
      startTransition(() => {
        router.push("/dashboard/product");
        queryClient.invalidateQueries({ queryKey: productKeys.detail(id) });
        queryClient.invalidateQueries({ queryKey: productKeys.lists() });
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
          breadcrumbs.slice(0, breadcrumbs.length - 1).concat(query.data.code)
        );
      }
      formRef.current?.reset(query.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.data?.id, breadcrumbs.length === 3]);

  console.log(query.isLoading)
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
      redirect("/dashboard/product");
    }
  }, [query.isError, showAlert, setLoading]);

  return {
    formRef,
    mutation,
    handleSetForm,
    handleClickSubmitForm,
  };
};
