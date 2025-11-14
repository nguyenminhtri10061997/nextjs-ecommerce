import { EPriceModifierType, Prisma } from "@prisma/client"
import { UseQueryResult } from "@tanstack/react-query"
import { startTransition, useMemo } from "react"
import { useFieldArray, UseFormReturn, useWatch } from "react-hook-form"
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

  const poWatch = useWatch({
    control: form.control,
    name: "productOptions",
  })

  const poSelectedMemo = useMemo(
    () =>
      poWatch?.map((i, idx) => ({
        optionId: i.optionId,
        idx,
      })) || [],
    [poWatch]
  )

  const poiSelectedMemo = useMemo(
    () =>
      poWatch?.[idx].productOptItems.map((poi, poiIdx) => ({
        idx: poiIdx,
        optionItemId: poi.optionItemId,
      })) || [],
    [poWatch, idx]
  )

  const poHash = useMemo(() => {
    return Object.fromEntries(queryOption.data?.map((i) => [i.id, i]) || [])
  }, [queryOption])

  return {
    productOptionItemArrField,
    poSelectedMemo,
    poHash,
    poiSelectedMemo,
    handleFillDefaultOption,
  }
}
