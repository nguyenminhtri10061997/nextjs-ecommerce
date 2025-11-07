"use client"

import { useAlertContext } from "@/components/hooks/useAlertContext"
import useFormRef from "@/components/hooks/useFormRef"
import { useLoadingCtx } from "@/components/hooks/useLoadingCtx"
import useLoadingWhenRoutePush from "@/components/hooks/useLoadingWhenRoutePush"
import {
  getOptionDetail,
  optionKeys,
  patchOption,
} from "@/lib/reactQuery/option"
import { TAppResponseBody } from "@/types/api/common"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { useParams } from "next/navigation"
import { useEffect } from "react"
import { SubmitHandler } from "react-hook-form"
import { TForm } from "./_components/optionForm/useIndex"

export const usePage = () => {
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()
  const { showAlert } = useAlertContext()
  const { setLoading } = useLoadingCtx()
  const { push } = useLoadingWhenRoutePush()

  const query = useQuery({
    queryKey: optionKeys.detail(id),
    queryFn: getOptionDetail,
    enabled: !!id,
  })

  const mutation = useMutation({
    mutationFn: patchOption,
    onSuccess: async () => {
      showAlert("Update Option success")
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: optionKeys.detail(id) }),
        queryClient.invalidateQueries({ queryKey: optionKeys.lists() }),
      ])
      push("/dashboard/option")
    },
    onError: (err: AxiosError<TAppResponseBody>) => {
      const message = err.response?.data.message || err.message
      showAlert(message, "error")
    },
  })

  const handleFormSubmit: SubmitHandler<TForm> = async (data) => {
    console.log(data)
    mutation.mutate({
      id,
      body: {
        ...data,
        optionItems: data.optionItems?.map((i, idx) => ({
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
