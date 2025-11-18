import { Card, CardContent } from "@mui/material"
import React, { useMemo } from "react"
import { UseFormReturn } from "react-hook-form"
import { TForm } from "../product-form/useIndex"
import SkuItem from "../sku"
import { TAttAndAttValHash } from "../variable-form/constants"

type TProps = {
  form: UseFormReturn<TForm>
  idx: number
  attAndAttValHash: TAttAndAttValHash
  paHashMemo: { [key: string]: NonNullable<TForm["attributes"]>[number] }
  pavHashMemo: {
    [key: string]: NonNullable<
      TForm["attributes"]
    >[number]["productAttValues"][number]
  }
  handleClickDeleteSku?: (idx: number) => void
}
export default React.memo(function Index(props: TProps) {
  const {
    form,
    idx,
    attAndAttValHash,
    handleClickDeleteSku,
    paHashMemo,
    pavHashMemo,
  } = props

  const attInfo = useMemo(() => {
    const curSku = form.getValues("skus")[idx]

    return curSku.productSkuAttVals
      .map((av) => {
        return `${attAndAttValHash.attHash[paHashMemo[av.productAttributeId].attributeId]?.name}: ${
          attAndAttValHash.attVHash[
            pavHashMemo[av.productAttributeValueId]?.attributeValueId
          ]?.name
        }`
      })
      .join(" - ")
  }, [attAndAttValHash, form, idx, paHashMemo, pavHashMemo])

  return (
    <Card variant="outlined" sx={{ marginTop: 1 }}>
      <CardContent sx={{ padding: "var(--mui-spacing) !important" }}>
        <SkuItem
          form={form}
          idx={idx}
          attInfo={attInfo}
          handleClickDeleteSku={handleClickDeleteSku}
        />
      </CardContent>
    </Card>
  )
})
