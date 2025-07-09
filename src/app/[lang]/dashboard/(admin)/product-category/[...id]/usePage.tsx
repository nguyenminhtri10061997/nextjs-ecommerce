"use client";

import { useAlertContext } from "@/hooks/useAlertContext";
import { useDashboardCtx } from "@/hooks/useDashboardCtx";
import useFormRef from "@/hooks/useFormRef";
import { useLoadingCtx } from "@/hooks/useLoadingCtx";
import { getProductCategoryDetail, patchProductCategory, productCategoryKeys } from "@/lib/reactQuery/product-category";
import { TAppResponseBody } from "@/types/api/common";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { redirect, useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { SubmitHandler } from "react-hook-form";
import { TForm } from "../_components/product-category-form/useIndex";

export type TPermissionState = Partial<Record<string, boolean>>;
export const usePage = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showAlert } = useAlertContext();
  const { setLoading } = useLoadingCtx();
  const { breadcrumbs, setBreadCrumbs } = useDashboardCtx();

  const query = useQuery({
    queryKey: productCategoryKeys.detail(id),
    queryFn: getProductCategoryDetail,
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: patchProductCategory,
    onSuccess: async () => {
      showAlert("Update ProductCategory success");
      router.push("/dashboard/product-category");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: productCategoryKeys.detail(id) }),
        queryClient.invalidateQueries({ queryKey: productCategoryKeys.lists() }),
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
      body: data,
    });
  };

  const { formRef, handleClickSubmitForm, handleSetForm } = useFormRef<TForm>({
    handleFormSubmit,
  });

  useEffect(() => {
    if (query.data?.id) {
      const {
        name,
        slug,
        seoTitle,description,
        seoDescription,
        displayOrder,
        isActive,
        productCategoryParentId,
      } = query.data;
      if (breadcrumbs.length === 3) {
        setBreadCrumbs(
          breadcrumbs.slice(0, breadcrumbs.length - 1).concat(query.data.name)
        );
      }
      formRef.current?.reset({
        name,
        slug,
        seoTitle,description,
        seoDescription,
        displayOrder,
        isActive,
        productCategoryParentId,
      });
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
        redirect("/dashboard/product-category");
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
