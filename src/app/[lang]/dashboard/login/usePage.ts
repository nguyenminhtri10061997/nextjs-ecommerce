"use client";
import useAppUseForm from "@/constants/reactHookForm";
import { useAlertContext } from "@/hooks/useAlertContext";
import { postLogin } from "@/lib/reactQuery/login";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

type Inputs = {
  username: string;
  password: string;
};

export const usePage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useAppUseForm<Inputs>();
  const { showAlert } = useAlertContext();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: postLogin,
    onSuccess: () => {
      router.replace("/dashboard");
    },
    onError: () => {
      showAlert("Tài khoản hoặc mật khẩu bị sai", "error");
    },
  });

  const handleClickSubmit = handleSubmit(async (data) => {
    mutation.mutate({
      username: data.username,
      password: data.password,
    });
  });

  return {
    errors,
    mutation,
    handleClickSubmit,
    register,
  };
};
