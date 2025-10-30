"use client"

import { PatchBodyDTO } from "@/app/api/user/[id]/validator"
import { useAlertContext } from "@/components/hooks/useAlertContext"
import { useLoadingCtx } from "@/components/hooks/useLoadingCtx"
import useLoadingWhenRoutePush from "@/components/hooks/useLoadingWhenRoutePush"
import { queryClient } from "@/lib/queryClient"
import { getUserDetail, putUser, userKeys } from "@/lib/reactQuery/user"
import { TAppResponseBody } from "@/types/api/common"
import { useMutation, useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { redirect, useParams } from "next/navigation"
import { FormEvent, useEffect, useRef } from "react"
import { SubmitHandler, UseFormReturn } from "react-hook-form"
import { output } from "zod/v4"
import { FormInputs } from "./_components/UserForm/useIndex"

export default function usePage() {
  const { id } = useParams<{ id: string }>()
  const { showAlert } = useAlertContext()
  const { setLoading } = useLoadingCtx()
  const { push } = useLoadingWhenRoutePush()

  const formRef = useRef<UseFormReturn<FormInputs>>(null)
  const query = useQuery<
    Awaited<ReturnType<typeof getUserDetail>>,
    AxiosError<TAppResponseBody>
  >({
    queryKey: userKeys.detail(id),
    queryFn: getUserDetail,
    enabled: !!id,
  })

  const mutation = useMutation({
    mutationFn: putUser,
    onSuccess: async () => {
      showAlert("update User success")
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: userKeys.detail(id) }),
        queryClient.invalidateQueries({ queryKey: userKeys.lists() }),
      ])
      push("/dashboard/user")
    },
    onError: (err: AxiosError<TAppResponseBody>) => {
      const message = err.response?.data.message || err.message
      showAlert(message, "error")
    },
  })

  if (query.error?.response?.data.message) {
    showAlert(query.error?.response?.data.message, "error")
    redirect("/dashboard/user")
  }

  const handleSetForm = (form: UseFormReturn<FormInputs>) => {
    formRef.current = form
  }

  const handleFormSubmit: SubmitHandler<output<typeof PatchBodyDTO>> = async (
    data
  ) => {
    mutation.mutate({
      newUser: {
        fullName: data.fullName,
        type: data.type,
        account: {
          newPassword: data.account.newPassword,
          username: data.account.username,
          roleId: data.account.roleId,
          isBanned: data.account.isBanned,
          isBlocked: data.account.isBlocked,
          accessTokenVersion: data.account.accessTokenVersion,
        },
      },
      id,
    })
  }

  const handleClickSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    formRef.current?.handleSubmit(handleFormSubmit)(e)
  }

  useEffect(() => {
    setLoading(query.isLoading)
  }, [query.isLoading, setLoading])

  useEffect(() => {
    if (query.data?.id) {
      formRef.current?.reset({
        fullName: query.data.fullName,
        type: query.data.type,
        account: {
          username: query.data.account?.username,
          roleId: query.data.account?.roleId,
          accessTokenVersion: query.data.account?.accessTokenVersion,
          isBanned: query.data.account?.isBanned,
          isBlocked: query.data.account?.isBlocked,
        },
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.data?.id])

  return {
    mutation,
    formRef,
    query,
    handleSetForm,
    handleClickSubmit,
  }
}
