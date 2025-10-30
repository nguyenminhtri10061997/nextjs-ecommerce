"use client";

import { useAlertContext } from "@/components/hooks/useAlertContext";
import { useDashboardCtx } from "@/components/hooks/useDashboardCtx";
import useFormRef from "@/components/hooks/useFormRef";
import { useLoadingCtx } from "@/components/hooks/useLoadingCtx";
import useLoadingWhenRoutePush from "@/components/hooks/useLoadingWhenRoutePush";
import {
  getProductDetail,
  patchProduct,
  productKeys,
} from "@/lib/reactQuery/product";
import { TAppResponseBody } from "@/types/api/common";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { redirect, useParams } from "next/navigation";
import { useEffect } from "react";
import { SubmitHandler } from "react-hook-form";
import { TForm } from "../_components/product-form/useIndex";

export type TPermissionState = Partial<Record<string, boolean>>;
export const usePage = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { showAlert } = useAlertContext();
  const { setLoading } = useLoadingCtx();
  const { breadcrumbs, setBreadCrumbs } = useDashboardCtx();
  const { push } = useLoadingWhenRoutePush();

  const query = useQuery({
    queryKey: productKeys.detail(id),
    queryFn: getProductDetail,
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: patchProduct,
    onSuccess: async () => {
      showAlert("Update Product Tag success");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: productKeys.detail(id) }),
        queryClient.invalidateQueries({ queryKey: productKeys.lists() }),
      ]);
      push("/dashboard/product");
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
        listImages: data.listImages.map(i => i.name!),
        
      }
    });
  };

  const { formRef, handleClickSubmitForm, handleSetForm } = useFormRef<TForm>({
    handleFormSubmit,
  });

  useEffect(() => {
    const { data } = query;
    if (data?.id) {
      if (breadcrumbs.length === 3) {
        setBreadCrumbs(
          breadcrumbs.slice(0, breadcrumbs.length - 1).concat(data.code)
        );
      }
      formRef.current?.reset({
        ...data,
        listImages: data.listImages.map((url) => ({ url })),
        mainImage: {
          url: data.mainImage,
        },
      });
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
