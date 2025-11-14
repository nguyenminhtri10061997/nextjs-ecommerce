import { EAttributeStatus, Prisma } from "@prisma/client"
import { UseQueryResult } from "@tanstack/react-query"
import { useMemo } from "react"
import { useFieldArray, UseFormReturn, useWatch } from "react-hook-form"
import { v4 } from "uuid"
import { TForm } from "../product-form/useIndex"
import { TAttAndAttValHash } from "../variable-form/constants"

type TProps = {
  form: UseFormReturn<TForm>
  idx: number
  queryAtt: UseQueryResult<
    Prisma.AttributeGetPayload<{ include: { attributeValues: true } }>[]
  >
  attAndAttValHash: TAttAndAttValHash
}
export default function useIndex(props: TProps) {
  const { form, idx, queryAtt, attAndAttValHash } = props
  const { control } = form

  const productAttValArrField = useFieldArray({
    control,
    name: `attributes.${idx}.productAttValues`,
  })

  const handleFillAttValsByExistAtt = (id: string) => {
    const found = queryAtt.data?.find((d) => d.id === id)
    form.setValue(
      `attributes.${idx}.productAttValues`,
      found!.attributeValues.map((atv) => ({
        id: v4(),
        attributeValueId: atv.id,
        status: EAttributeStatus.ACTIVE,
      }))
    )
  }

  const attributeWatch = useWatch({
    control: form.control,
    name: "attributes",
  })

  const attributeIdsSelectedMemo = useMemo(
    () =>
      attributeWatch?.map((i, idx) => ({
        attributeId: i.attributeId,
        idx,
      })),
    [attributeWatch]
  )

  const attVIdsSelectedMemo = useMemo(
    () =>
      attributeWatch?.flatMap((i) =>
        i.productAttValues.map((pAttV, idx) => ({
          attVId: pAttV.attributeValueId,
          idx,
        }))
      ) || [],
    [attributeWatch]
  )

  const attVsMemo = useMemo(() => {
    return (
      attAndAttValHash.attHash[
        attributeWatch?.[idx].attributeId as keyof TAttAndAttValHash["attHash"]
      ]?.attributeValues || []
    )
  }, [attAndAttValHash, attributeWatch, idx])

  return {
    attVsMemo,
    productAttValArrField,
    attributeIdsSelectedMemo,
    attVIdsSelectedMemo,
    handleFillAttValsByExistAtt,
  }
}
