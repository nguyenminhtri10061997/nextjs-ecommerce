import useAppUseForm from "@/constants/reactHookForm";
import { Brand } from "@prisma/client";

export type TForm = Pick<Brand, "name" | "slug" | "isActive">;

export default function useIndex() {
  const form = useAppUseForm<TForm>();

  return {
    form,
  };
}
