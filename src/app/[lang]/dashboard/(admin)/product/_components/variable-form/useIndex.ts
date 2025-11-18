import { generateCombinations } from "@/common"
import { useAlertContext } from "@/components/hooks/useAlertContext"
import { useGetAttributeListQuery } from "@/lib/reactQuery/attribute"
import { startTransition, useMemo } from "react"
import { useFieldArray, UseFormReturn, useWatch } from "react-hook-form"
import { TForm } from "../product-form/useIndex"
import { TAttAndAttValHash } from "./constants"

type TProps = {
  form: UseFormReturn<TForm>
}
export default function useIndex(props: TProps) {
  const { form } = props

  const queryAtt = useGetAttributeListQuery({
    orderQuery: {
      orderKey: "displayOrder",
      orderType: "asc",
    },
  })
  const { showAlert } = useAlertContext()
  const attAndAttValHash: TAttAndAttValHash = useMemo(() => {
    const attHash: TAttAndAttValHash["attHash"] = {}
    const attVHash: TAttAndAttValHash["attVHash"] = {}
    queryAtt.data?.forEach((att) => {
      attHash[att.id] = att
      att.attributeValues.forEach((attV) => {
        attVHash[attV.id] = attV
      })
    })
    return {
      attHash,
      attVHash,
    }
  }, [queryAtt.data])

  const productAttArrField = useFieldArray({
    control: form.control,
    name: "attributes",
  })

  const skuArrField = useFieldArray({
    control: form.control,
    name: "skus",
  })

  const handleClickGenSku = async () => {
    const att = form.getValues("attributes")
    if (!att?.length) {
      showAlert("Please add at least one Attribute", "error")
      return
    }
    const isValid = await form.trigger("attributes")
    if (!isValid) {
      return
    }

    const resCombination = generateCombinations(
      att
        .filter((i) => i.attributeId && i.isUsedForVariations)
        .map((pa) => {
          return pa.productAttValues
            .filter((v) => v.attributeValueId)
            .map((pav) => ({
              attributeId: pa.attributeId,
              attributeValueId: pav.attributeValueId,
              pavId: pav.id,
              paId: pa.id,
            }))
        })
    )
    startTransition(() => {
      form.setValue(
        "skus",
        resCombination.map(
          (attVs) =>
            ({
              price: 0,
              stockType: "MANUAL",
              stockStatus: "STOCKING",
              status: "ACTIVE",
              productSkuAttVals: attVs.map((v) => ({
                productAttributeId: v.paId,
                productAttributeValueId: v.pavId,
              })),
            }) as TForm["skus"][number]
        )
      )
    })
  }

  const handleClickDeleteSku = (idx: number) => {
    skuArrField.remove(idx)
  }

  const paWatch = useWatch({
    control: form.control,
    name: "attributes",
  })

  const paHashMemo = useMemo(
    () => Object.fromEntries(paWatch?.map((i) => [i.id, i]) || []) || {},
    [paWatch]
  )

  const pavHashMemo = useMemo(
    () =>
      Object.fromEntries(
        paWatch?.flatMap((i) => i.productAttValues?.map((j) => [j.id, j])) || []
      ) || {},
    [paWatch]
  )

  return {
    queryAtt,
    productAttArrField,
    skuArrField,
    attAndAttValHash,
    paHashMemo,
    pavHashMemo,
    handleClickGenSku,
    handleClickDeleteSku,
  }
}
