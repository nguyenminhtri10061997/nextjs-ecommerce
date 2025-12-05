import { PostCreateBodyDTO } from "@/app/api/product-tag/validator"
import useAppUseForm from "@/components/hooks/useAppUseForm"
import { output } from "zod/v4"

export type TForm = output<typeof PostCreateBodyDTO>

export default function useIndex() {
  const form = useAppUseForm<TForm>({
    defaultValues: {
      isActive: true,
    }
  })

  return {
    form,
  }
}
