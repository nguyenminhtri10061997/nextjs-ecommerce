"use client"

import { useAlertContext } from "@/components/hooks/useAlertContext"
import useFormRef from "@/components/hooks/useFormRef"
import { useLoadingCtx } from "@/components/hooks/useLoadingCtx"
import useLoadingWhenRoutePush from "@/components/hooks/useLoadingWhenRoutePush"
import {
  getProductTagDetail,
  patchProductTag,
  productTagKeys,
} from "@/lib/reactQuery/product-tag"
import { TAppResponseBody } from "@/types/api/common"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { redirect, useParams } from "next/navigation"
import { useEffect } from "react"
import { SubmitHandler } from "react-hook-form"
import { TForm } from "../_components/product-tag-form/useIndex"

export const usePage = () => {
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()
  const { showAlert } = useAlertContext()
  const { setLoading } = useLoadingCtx()
  const { push } = useLoadingWhenRoutePush()

  const query = useQuery({
    queryKey: productTagKeys.detail(id),
    queryFn: getProductTagDetail,
    enabled: !!id,
  })

  const mutation = useMutation({
    mutationFn: patchProductTag,
    onSuccess: async () => {
      showAlert("Update Product Tag success")
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: productTagKeys.detail(id) }),
        queryClient.invalidateQueries({ queryKey: productTagKeys.lists() }),
      ])
      push("/dashboard/product-tag")
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
      formRef.current?.reset(query.data)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.data?.id])

  console.log(query.isLoading)
  useEffect(() => {
    setLoading(query.isLoading)
  }, [query.isLoading, setLoading])

  useEffect(() => {
    if (query.isError) {
      showAlert("Error Get Product Tag", "error")
      setLoading(false)
      redirect("/dashboard/product-tag")
    }
  }, [query.isError, showAlert, setLoading])

  return {
    formRef,
    mutation,
    handleSetForm,
    handleClickSubmitForm,
  }
}
