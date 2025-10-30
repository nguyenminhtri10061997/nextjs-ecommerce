"use client"

import { PostUserCreateBodyDTO } from "@/app/api/user/validator"
import { useAlertContext } from "@/components/hooks/useAlertContext"
import useFormRef from "@/components/hooks/useFormRef"
import useLoadingWhenRoutePush from "@/components/hooks/useLoadingWhenRoutePush"
import { roleKeys } from "@/lib/reactQuery/role"
import { postCreateUser } from "@/lib/reactQuery/user"
import { TAppResponseBody } from "@/types/api/common"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { useEffect } from "react"
import { SubmitHandler } from "react-hook-form"
import { output } from "zod/v4"

export const usePage = () => {
  const queryClient = useQueryClient()
  const { showAlert } = useAlertContext()
  const { push } = useLoadingWhenRoutePush()

  const mutation = useMutation({
    mutationFn: postCreateUser,
    onSuccess: async () => {
      showAlert("create User success")
      await queryClient.invalidateQueries({ queryKey: roleKeys.lists() })
      push("/dashboard/user")
    },
    onError: (err: AxiosError<TAppResponseBody>) => {
      const message = err.response?.data.message || err.message
      showAlert(message, "error")
    },
  })

  const handleFormSubmit: SubmitHandler<
    output<typeof PostUserCreateBodyDTO>
  > = async (data) => {
    mutation.mutate(data)
  }

  const { formRef, handleClickSubmitForm, handleSetForm } = useFormRef<
    output<typeof PostUserCreateBodyDTO>
  >({
    handleFormSubmit,
  })

  useEffect(() => {
    formRef.current?.reset({
      type: "STAFF",
    })
  }, [formRef])

  return {
    formRef,
    mutation,
    handleClickSubmitForm,
    handleSetForm,
    handleFormSubmit,
  }
}
