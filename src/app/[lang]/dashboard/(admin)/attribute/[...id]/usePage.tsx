"use client"

import { useAlertContext } from "@/components/hooks/useAlertContext"
import useFormRef from "@/components/hooks/useFormRef"
import { useLoadingCtx } from "@/components/hooks/useLoadingCtx"
import useLoadingWhenRoutePush from "@/components/hooks/useLoadingWhenRoutePush"
import {
  attributeKeys,
  getAttributeDetail,
  patchAttribute,
} from "@/lib/reactQuery/attribute"
import { TAppResponseBody } from "@/types/api/common"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { useParams } from "next/navigation"
import { useEffect } from "react"
import { SubmitHandler } from "react-hook-form"
import { TForm } from "./_components/attributeForm/useIndex"

export type TPermissionState = Partial<Record<string, boolean>>
export const usePage = () => {
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()
  const { showAlert } = useAlertContext()
  const { setLoading } = useLoadingCtx()
  const { push } = useLoadingWhenRoutePush()

  const query = useQuery({
    queryKey: attributeKeys.detail(id),
    queryFn: getAttributeDetail,
    enabled: !!id,
  })

  const mutation = useMutation({
    mutationFn: patchAttribute,
    onSuccess: async () => {
      showAlert("Update Attribute success")
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: attributeKeys.detail(id) }),
        queryClient.invalidateQueries({ queryKey: attributeKeys.lists() }),
      ])
      push("/dashboard/attribute")
    },
    onError: (err: AxiosError<TAppResponseBody>) => {
      const message = err.response?.data.message || err.message
      showAlert(message, "error")
    },
  })

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
    })
  }

  const { formRef, handleClickSubmitForm, handleSetForm } = useFormRef<TForm>({
    handleFormSubmit,
  })

  useEffect(() => {
    setLoading(query.isLoading)
  }, [query.isLoading, setLoading])

  useEffect(() => {
    if (query.data?.id) {
      const { data } = query
      formRef.current?.reset(data)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.data?.id])

  return {
    formRef,
    mutation,
    handleSetForm,
    handleClickSubmitForm,
  }
}
