import useAppUseForm from "@/constants/reactHookForm";
import { Language } from "@prisma/client";

export type TForm = Omit<Language, "id" | "createdAt" | "updatedAt">;

export default function useIndex() {
  const form = useAppUseForm<TForm>();

  return {
    form,
  };
}
