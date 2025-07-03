"use client";
import { useAlertContext } from "@/hooks/useAlertContext";
import { withRequestHandler } from "@/lib/HOF/withRequestHandler";
import axios from "axios";
import { redirect } from "next/navigation";
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
  const { showAlert } = useAlertContext()
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleClickSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true)
    const res = await withRequestHandler(
      axios.post("/api/auth/login", {
        username: data.username,
        password: data.password,
      })
    );
    setIsLoading(false)

    if (!res.isSuccess) {
      showAlert("Tài khoản hoặc mật khẩu bị sai", 'error')
    }

    redirect('/dashboard')
  };

  return {
    errors,
    showPassword,
    isLoading,
    handleTogglePassword,
    handleClickSubmit,
    register,
    handleSubmit,
  };
};
