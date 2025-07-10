import { ProductTag } from "@prisma/client";
import { useForm } from "react-hook-form";

export type TForm = Omit<ProductTag, "id" | "createdAt" | "updatedAt">;

export default function useIndex() {
  const form = useForm<TForm>({
    mode: "onBlur",
  });

  return {
    form,
  };
}
