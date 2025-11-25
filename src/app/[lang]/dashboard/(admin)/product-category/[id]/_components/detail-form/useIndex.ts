import { PatchBodyDTO } from "@/app/api/product-category/[id]/validator"
import { useAlertContext } from "@/components/hooks/useAlertContext"
import { useLoadingCtx } from "@/components/hooks/useLoadingCtx"
import useAppUseForm from "@/constants/reactHookForm"
import { useGetProductCategoryListQuery } from "@/lib/reactQuery/product-category"
import { useEffect } from "react"
import { output } from "zod/v4"

export type TForm = output<typeof PatchBodyDTO>

export default function useIndex() {
  const form = useAppUseForm<TForm>()
  const { setLoading } = useLoadingCtx()
  const { showAlert } = useAlertContext()

  const query = useGetProductCategoryListQuery({})

  useEffect(() => {
    setLoading(query.isLoading)
  }, [query.isLoading, setLoading])

  useEffect(() => {
    if (query.isError) {
      showAlert(query.error.message, "error")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.isError, showAlert])

  return {
    query,
    form,
  }
}
