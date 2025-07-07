import { Brand } from "@prisma/client";
import { useForm } from "react-hook-form";

export type TForm = Pick<Brand, "name" | "slug" | "logoImage">;

export default function useIndex() {
  const form = useForm<TForm>({
    mode: "onBlur",
  });

  return {
    form,
  };
}
