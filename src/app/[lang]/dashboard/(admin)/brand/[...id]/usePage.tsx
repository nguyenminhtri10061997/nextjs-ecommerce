"use client";

import { useAlertContext } from "@/components/hooks/useAlertContext";
import useFormRef from "@/components/hooks/useFormRef";
import { useLoadingCtx } from "@/components/hooks/useLoadingCtx";
import useLoadingWhenRoutePush from "@/components/hooks/useLoadingWhenRoutePush";
import { brandKeys, getBrandDetail, patchBrand } from "@/lib/reactQuery/brand";
import { TAppResponseBody } from "@/types/api/common";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { redirect, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler } from "react-hook-form";
import { TForm } from "../_components/brandForm/useIndex";

export type TPermissionState = Partial<Record<string, boolean>>;
export const usePage = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { showAlert } = useAlertContext();
  const { setLoading } = useLoadingCtx();
  const { push } = useLoadingWhenRoutePush();
  const [isUploading, setIsUploading] = useState(false);

  const query = useQuery({
    queryKey: brandKeys.detail(id),
    queryFn: getBrandDetail,
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: patchBrand,
    onSuccess: async () => {
      showAlert("Update Brand success");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: brandKeys.detail(id) }),
        queryClient.invalidateQueries({ queryKey: brandKeys.lists() }),
      ]);
      push("/dashboard/brand");
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
      formRef.current?.reset(query.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.data?.id]);

  useEffect(() => {
    setLoading(query.isLoading);
  }, [query.isLoading, setLoading]);

  useEffect(() => {
    if (query.isError) {
      showAlert("Error Get Brand", "error");
      setLoading(false);
      redirect("/dashboard/brand");
    }
  }, [query.isError, showAlert, setLoading]);

  return {
    isUploading,
    mutation,
    handleSetForm,
    handleClickSubmitForm,
    setIsUploading,
  };
};
