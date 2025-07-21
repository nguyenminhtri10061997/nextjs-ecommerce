"use client";

import { useAlertContext } from "@/hooks/useAlertContext";
import { useDashboardCtx } from "@/hooks/useDashboardCtx";
import useFormRef from "@/hooks/useFormRef";
import { useLoadingCtx } from "@/hooks/useLoadingCtx";
import useLoadingWhenRoutePush from "@/hooks/useLoadingWhenRoutePush";
import {
  attributeKeys,
  getAttributeDetail,
  patchAttribute,
} from "@/lib/reactQuery/attribute";
import { TAppResponseBody } from "@/types/api/common";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { SubmitHandler } from "react-hook-form";
import { v4 } from "uuid";
import { TForm } from "../_components/attributeForm/useIndex";

export type TPermissionState = Partial<Record<string, boolean>>;
export const usePage = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { showAlert } = useAlertContext();
  const { breadcrumbs, setBreadCrumbs } = useDashboardCtx();
  const { loading, setLoading } = useLoadingCtx();
  const { push } = useLoadingWhenRoutePush();

  const query = useQuery({
    queryKey: attributeKeys.detail(id),
    queryFn: getAttributeDetail,
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: patchAttribute,
    onSuccess: async () => {
      showAlert("Update Attribute success");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: attributeKeys.detail(id) }),
        queryClient.invalidateQueries({ queryKey: attributeKeys.lists() }),
      ]);
      push("/dashboard/attribute");
    },
    onError: (err: AxiosError<TAppResponseBody>) => {
      const message = err.response?.data.message || err.message;
      showAlert(message, "error");
    },
  });

  const handleFormSubmit: SubmitHandler<TForm> = async ({
    name,
    slug,
    type,
    attributeValues,
  }) => {
    mutation.mutate({
      id,
      body: {
        name,
        slug,
        type,
        attributeValues: attributeValues.map((i, idx) => ({
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
      const { attributeValues, ...item } = query.data;
      if (breadcrumbs.length === 3) {
        setBreadCrumbs(
          breadcrumbs.slice(0, breadcrumbs.length - 1).concat(query.data.name)
        );
      }
      formRef.current?.reset({
        ...item,
        attributeValues: attributeValues.map((i) => ({
          ...i,
          idDnD: v4(),
        })),
      });
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.data?.id, breadcrumbs.length === 3]);

  useEffect(() => {
    if (query.isLoading && !loading) {
      setLoading(true);
    }
  }, [query.isLoading, setLoading, loading]);

  return {
    formRef,
    mutation,
    handleSetForm,
    handleClickSubmitForm,
  };
};
