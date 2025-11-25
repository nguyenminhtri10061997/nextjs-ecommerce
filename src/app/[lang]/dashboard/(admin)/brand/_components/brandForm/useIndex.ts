'use client'

import { PostCreateBodyDTO } from "@/app/api/brand/validator";
import { useForm } from "react-hook-form";
import { output } from "zod/v4";

export type TForm = output<typeof PostCreateBodyDTO>;

export default function useIndex() {
  const form = useForm<TForm>({
    mode: "onBlur",
    defaultValues: {
      isActive: true,
    },
  });

  return {
    form,
  };
}
