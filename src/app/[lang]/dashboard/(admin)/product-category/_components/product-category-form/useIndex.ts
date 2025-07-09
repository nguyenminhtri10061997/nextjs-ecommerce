import { useAlertContext } from "@/hooks/useAlertContext";
import { useLoadingCtx } from "@/hooks/useLoadingCtx";
import { useGetProductCategoryListQuery } from "@/lib/reactQuery/product-category";
import { ProductCategory } from "@prisma/client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export type TForm = Omit<ProductCategory, "id" | "createdAt" | "updatedAt">;

export default function useIndex() {
  const form = useForm<TForm>({
    mode: "onBlur",
  });
  const { setLoading } = useLoadingCtx();
  const { showAlert } = useAlertContext();

  const query = useGetProductCategoryListQuery({});

  useEffect(() => {
    setLoading(query.isLoading);
  }, [query.isLoading, setLoading]);

  useEffect(() => {
    if (query.isError) {
      showAlert(query.error.message, "error");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.isError, showAlert]);

  return {
    query,
    form,
  };
}
