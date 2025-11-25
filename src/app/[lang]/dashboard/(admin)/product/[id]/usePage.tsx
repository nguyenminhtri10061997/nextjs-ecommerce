"use client"

import { useAlertContext } from "@/components/hooks/useAlertContext"
import useFormRef from "@/components/hooks/useFormRef"
import { useLoadingCtx } from "@/components/hooks/useLoadingCtx"
import useLoadingWhenRoutePush from "@/components/hooks/useLoadingWhenRoutePush"
import {
  getProductDetail,
  patchProduct,
  productKeys,
} from "@/lib/reactQuery/product"
import { TAppResponseBody } from "@/types/api/common"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { redirect, useParams } from "next/navigation"
import { useEffect } from "react"
import { SubmitHandler } from "react-hook-form"
import { TForm } from "../_components/product-form/useIndex"

export const usePage = () => {
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()
  const { showAlert } = useAlertContext()
  const { setLoading } = useLoadingCtx()
  const { push } = useLoadingWhenRoutePush()

  const query = useQuery({
    queryKey: productKeys.detail(id),
    queryFn: getProductDetail,
    enabled: !!id,
  })

  const mutation = useMutation({
    mutationFn: patchProduct,
    onSuccess: async () => {
      showAlert("Update Product Tag success")
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: productKeys.detail(id) }),
        queryClient.invalidateQueries({ queryKey: productKeys.lists() }),
      ])
      push("/dashboard/product")
    },
    onError: (err: AxiosError<TAppResponseBody>) => {
      const message = err.response?.data.message || err.message
      showAlert(message, "error")
    },
  })

  const handleFormSubmit: SubmitHandler<TForm> = async (data) => {
    mutation.mutate({
      id,
      body: {
        ...data,
        listImages: data.listImages.map((i) => i.name!),
        attributes: data.attributes || [],
        productOpts: data.productOptions || [],
        productToProductTags: data.productToProductTags || [],
        skus: data.skus || [],
      },
    })
  }

  const { formRef, handleClickSubmitForm, handleSetForm } = useFormRef<TForm>({
    handleFormSubmit,
  })

  useEffect(() => {
    const { data } = query
    if (data?.id) {
      formRef.current?.reset({
        code: data.code,
        name: data.name,
        slug: data.slug,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        description: data.description,
        productCategoryId: data.productCategoryId,
        brandId: data.brandId,
        detail: data.detail,
        mainImage: data.mainImage,
        listImages: data.listImages.map((i) => ({
          name: i,
        })),
        viewCount: data.viewCount,
        soldCount: data.soldCount,
        type: data.type,
        isActive: data.isActive,
        avgRateByAdmin: data.avgRateByAdmin,
        avgRateBySystem: data.avgRateBySystem,
      })

      formRef.current?.setValue(
        "attributes",
        data.productAttributes.map((pa) => ({
          attributeId: pa.attributeId,
          id: pa.id,
          status: pa.status,
          displayOrder: pa.displayOrder,
          isUsedForVariations: pa.isUsedForVariations,
          productAttValues: pa.productAttributeValues.map(
            (pav) =>
              ({
                attributeValueId: pav.attributeValueId,
                id: pav.id,
                status: pav.status,
                displayOrder: pav.displayOrder,
                image: pav.image,
              }) as NonNullable<
                TForm["attributes"]
              >[number]["productAttValues"][number]
          ),
        })),
        {
          shouldValidate: false,
          shouldDirty: false,
        }
      )

      formRef.current?.setValue(
        "productOptions",
        data.productOptions.map((po) => ({
          isRequired: po.isRequired,
          optionId: po.optionId,
          productOptItems: po.ProductOptionToOptionItem.map((poi) => ({
            optionItemId: poi.optionItemId,
            priceModifierType: poi.priceModifierType,
            priceModifierValue: poi.priceModifierValue,
            displayOrder: poi.displayOrder,
          })) as NonNullable<
            TForm["productOptions"]
          >[number]["productOptItems"],
          displayOrder: po.displayOrder,
          maxSelect: po.maxSelect,
        })) as TForm["productOptions"],
        {
          shouldValidate: false,
          shouldDirty: false,
        }
      )


      formRef.current?.setValue('skus', data.productSkus.map(sku => ({
        id: sku.id,
        sellerSku: sku.sellerSku,
        stockStatus: sku.stockStatus,
        stockType: sku.stockType,
        image: sku.image,
        salePrice: sku.salePrice,
        price: sku.price,
        costPrice: sku.costPrice,
        stock: sku.stock,
        downloadUrl: sku.downloadUrl,
        note: sku.note,
        barcode: sku.barcode,
        weight: sku.weight,
        width: sku.width,
        height: sku.height,
        length: sku.length,
        displayOrder: sku.displayOrder,
        isDefault: sku.isDefault,
        status: sku.status,
        productSkuAttVals: (sku.skuAttributeValues || []).map(sav => ({
          productAttributeId: sav.productAttributeId,
          productAttributeValueId: sav.productAttributeValueId,
        })),
      })) as TForm['skus'], {
        shouldValidate: false,
        shouldDirty: false,
      })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.data?.id])

  useEffect(() => {
    setLoading(query.isLoading)
  }, [query.isLoading, setLoading])

  useEffect(() => {
    if (query.isError) {
      showAlert("Error Get Product Tag", "error")
      setLoading(false)
      redirect("/dashboard/product")
    }
  }, [query.isError, showAlert, setLoading])

  return {
    formRef,
    mutation,
    handleSetForm,
    handleClickSubmitForm,
  }
}
