import useAppUseForm from "@/constants/reactHookForm";
import { ProductTag } from "@prisma/client";

export type TForm = Omit<ProductTag, "id" | "createdAt" | "updatedAt">;

export default function useIndex() {
  const form = useAppUseForm<TForm>();

  return {
    form,
  };
}
