import { Language } from "@prisma/client";
import { useForm } from "react-hook-form";

export type TForm = Omit<Language, "id" | "createdAt" | "updatedAt">;

export default function useIndex() {
  const form = useForm<TForm>({
    mode: "onBlur",
  });

  return {
    form,
  };
}
