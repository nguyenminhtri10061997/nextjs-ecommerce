"use client"
import { useAlertContext } from "@/components/hooks/useAlertContext"
import useLoadingWhenRoutePush from "@/components/hooks/useLoadingWhenRoutePush"
import useAppUseForm from "@/constants/reactHookForm"
import { postLogin } from "@/lib/reactQuery/auth"
import { useMutation } from "@tanstack/react-query"
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
    onError: () => {
      showAlert("Tài khoản hoặc mật khẩu bị sai", "error")
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
