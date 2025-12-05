"use client"
import { useAlertContext } from "@/components/hooks/useAlertContext"
import useLoadingWhenRoutePush from "@/components/hooks/useLoadingWhenRoutePush"
import useAppUseForm from "@/components/hooks/useAppUseForm"
import { postLogin } from "@/lib/reactQuery/auth"
import { TAppResponseBody } from "@/types/api/common"
import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { SubmitHandler } from "react-hook-form"

type Inputs = {
  username: string
  password: string
}

export const usePage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useAppUseForm<Inputs>()
  const { showAlert } = useAlertContext()

  const { replace } = useLoadingWhenRoutePush()

  const mutation = useMutation({
    mutationFn: postLogin,
    onSuccess: () => {
      replace("/dashboard")
    },
    onError: (err: AxiosError<TAppResponseBody>) => {
      let message = "Wrong username or password"
      if (err.status === 402) {
        message = err.response?.data?.message || message
      }
      showAlert(message, "error")
    },
  })

  const handleClickSubmit: SubmitHandler<Inputs> = (data) => {
    mutation.mutate({
      password: data.password,
      username: data.username,
    })
  }

  return {
    mutation,
    errors,
    handleClickSubmit,
    register,
    handleSubmit,
  }
}
