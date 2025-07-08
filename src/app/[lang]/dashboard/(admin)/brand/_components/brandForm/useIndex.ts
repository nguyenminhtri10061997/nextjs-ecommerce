import { Brand } from "@prisma/client";
import { useForm } from "react-hook-form";

export type TForm = Pick<Brand, "name" | "slug">;

export default function useIndex() {
  const form = useForm<TForm>({
    mode: "onBlur",
  });

  return {
    form,
  };
}
