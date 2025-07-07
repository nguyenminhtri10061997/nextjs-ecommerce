"use client";

import { useAlertContext } from "@/hooks/useAlertContext";
import { useDashboardCtx } from "@/hooks/useDashboardCtx";
import useFormRef from "@/hooks/useFormRef";
import { brandKeys, getBrandDetail, patchBrand } from "@/lib/reactQuery/brand";
import { TAppResponseBody } from "@/types/api/common";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { SubmitHandler } from "react-hook-form";
import { TForm } from "../_components/brandForm/useIndex";

export type TPermissionState = Partial<Record<string, boolean>>;
export const usePage = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showAlert } = useAlertContext();
  const { breadcrumbs, setBreadCrumbs } = useDashboardCtx();

  const query = useQuery({
    queryKey: brandKeys.detail(id),
    queryFn: getBrandDetail,
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: patchBrand,
    onSuccess: async () => {
      showAlert("Update Brand success");
      router.push("/dashboard/brand");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: brandKeys.detail(id) }),
        queryClient.invalidateQueries({ queryKey: brandKeys.lists() }),
      ]);
    },
    onError: (err: AxiosError<TAppResponseBody>) => {
      const message = err.response?.data.message || err.message;
      showAlert(message, "error");
    },
  });

  const handleFormSubmit: SubmitHandler<TForm> = async ({ name, slug }) => {
    mutation.mutate({
      id,
      body: {
        name,
        slug,
      },
    });
  };

  const { formRef, handleClickSubmitForm, handleSetForm } = useFormRef<TForm>({
    handleFormSubmit,
  });

  useEffect(() => {
    if (query.data?.id) {
      const { name, slug } = query.data;
      if (breadcrumbs.length === 3) {
        setBreadCrumbs(
          breadcrumbs.slice(0, breadcrumbs.length - 1).concat(query.data.name)
        );
      }
      formRef.current?.reset({
        name,
        slug,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.data?.id, breadcrumbs.length === 3]);

  return {
    formRef,
    mutation,
    handleSetForm,
    handleClickSubmitForm,
  };
};
