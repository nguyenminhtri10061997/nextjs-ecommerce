import { EPriceModifierType, Prisma } from "@prisma/client"
import { UseQueryResult } from "@tanstack/react-query"
import { startTransition, useDeferredValue, useEffect, useState } from "react"
import { useFieldArray, UseFormReturn } from "react-hook-form"
import { TForm } from "../product-form/useIndex"

type TProps = {
  form: UseFormReturn<TForm>
  idx: number
  queryOption: UseQueryResult<
    Prisma.OptionGetPayload<{ include: { optionItems: true } }>[],
    Error
  >
}
export default function useIndex(props: TProps) {
  const { form, idx, queryOption } = props
  const { control } = form

  const productOptionItemArrField = useFieldArray({
    control,
    name: `productOptions.${idx}.productOptItems`,
  })

  const [productOIIdSelected, setProductOIIdSelected] = useState<
    (string | null)[]
  >([])
  const productOIIdSelectedDeferred = useDeferredValue(productOIIdSelected)

  useEffect(() => {
    const callbackSub = form.subscribe({
      name: `productOptions.${idx}.productOptItems`,
      formState: {
        values: true,
      },
      callback: (ctx) => {
        setProductOIIdSelected(
          ctx.values.productOptions?.[idx].productOptItems?.map(
            (i) => i.optionItemId
          ) || []
        )
      },
    })
    return () => callbackSub()
  }, [form, idx])

  const handleFillDefaultOption = (id: string, idxOpt: number) => {
    const found = queryOption.data?.find((i) => i.id === id)
    if (found) {
      startTransition(() => {
        form.setValue(
          `productOptions.${idxOpt}.productOptItems`,
          found.optionItems.map((i) => ({
            optionItemId: i.id,
            priceModifierType: EPriceModifierType.FREE,
            priceModifierValue: 0,
          }))
        )
      })
    }
  }

  return {
    productOptionItemArrField,
    productOIIdSelectedDeferred,
    handleFillDefaultOption,
  }
}
