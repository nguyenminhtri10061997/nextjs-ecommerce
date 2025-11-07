"use client"

import { useAlertContext } from "@/components/hooks/useAlertContext"
import useFormRef from "@/components/hooks/useFormRef"
import { useLoadingCtx } from "@/components/hooks/useLoadingCtx"
import useLoadingWhenRoutePush from "@/components/hooks/useLoadingWhenRoutePush"
import {
  getProductCategoryDetail,
  patchProductCategory,
  productCategoryKeys,
} from "@/lib/reactQuery/product-category"
import { TAppResponseBody } from "@/types/api/common"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { redirect, useParams } from "next/navigation"
import { useEffect } from "react"
import { SubmitHandler } from "react-hook-form"
import { TForm } from "./_components/detail-form/useIndex"

export type TPermissionState = Partial<Record<string, boolean>>
export const usePage = () => {
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()
  const { showAlert } = useAlertContext()
  const { setLoading } = useLoadingCtx()
  const { push } = useLoadingWhenRoutePush()

  const query = useQuery({
    queryKey: productCategoryKeys.detail(id),
    queryFn: getProductCategoryDetail,
    enabled: !!id,
  })

  const mutation = useMutation({
    mutationFn: patchProductCategory,
    onSuccess: async () => {
      showAlert("Update ProductCategory success")
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: productCategoryKeys.detail(id),
        }),
        queryClient.invalidateQueries({
          queryKey: productCategoryKeys.lists(),
        }),
      ])
      push("/dashboard/product-category")
    },
    onError: (err: AxiosError<TAppResponseBody>) => {
      const message = err.response?.data.message || err.message
      showAlert(message, "error")
    },
  })

  const handleFormSubmit: SubmitHandler<TForm> = async (data) => {
    mutation.mutate({
      id,
      body: data,
    })
  }

  const { formRef, handleClickSubmitForm, handleSetForm } = useFormRef<TForm>({
    handleFormSubmit,
  })

  useEffect(() => {
    if (query.data?.id) {
      const {
        name,
        slug,
        seoTitle,
        description,
        seoDescription,
        displayOrder,
        isActive,
        productCategoryParentId,
      } = query.data
      formRef.current?.reset({
        name,
        slug,
        seoTitle,
        description,
        seoDescription,
        displayOrder,
        isActive,
        productCategoryParentId,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.data?.id])

  useEffect(() => {
    setLoading(query.isLoading)
  }, [query.isLoading, setLoading])

  useEffect(() => {
    if (query.isError) {
      showAlert("Error Get Product Category", "error")
      setLoading(false)
      redirect("/dashboard/product-category")
    }
  }, [query.isError, showAlert, setLoading])

  return {
    query,
    formRef,
    mutation,
    handleSetForm,
    handleClickSubmitForm,
  }
}
