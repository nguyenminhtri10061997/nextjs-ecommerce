"use client";
import { postLogin } from "@/call-api/auth";
import { useAlertContext } from "@/hooks/useAlertContext";
import useLoadingWhenRoutePush from "@/hooks/useLoadingWhenRoutePush";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type Inputs = {
  username: string;
  password: string;
};

export const usePage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    mode: "onBlur",
  });
  const { showAlert } = useAlertContext();
  const [showPassword, setShowPassword] = useState(false);
  const { replace } = useLoadingWhenRoutePush();

  const mutation = useMutation({
    mutationFn: postLogin,
    onSuccess: () => {
      replace("/dashboard");
    },
    onError: () => {
      showAlert("Tài khoản hoặc mật khẩu bị sai", "error");
    },
  });

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleClickSubmit: SubmitHandler<Inputs> = (data) => {
    mutation.mutate({
      password: data.password,
      username: data.username,
    });
  };

  return {
    mutation,
    errors,
    showPassword,
    handleTogglePassword,
    handleClickSubmit,
    register,
    handleSubmit,
  };
};
