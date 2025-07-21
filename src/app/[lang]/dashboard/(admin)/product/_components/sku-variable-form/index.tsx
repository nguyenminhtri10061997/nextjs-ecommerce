import { UseFormReturn } from "react-hook-form";
import { TForm } from "../product-form/useIndex";
import { Card, CardContent } from "@mui/material";
import SkuItem from "../sku";
import React, { useMemo } from "react";
import { TAttValHash } from "../variable-form/useIndex";

type TProps = {
  form: UseFormReturn<TForm>;
  idx: number;
  attAndAttValHashDeferred: TAttValHash;
  handleClickDeleteSku?: (idx: number) => void;
};
export default React.memo(function Index(props: TProps) {
  const { form, idx, attAndAttValHashDeferred, handleClickDeleteSku } = props;

  const attInfo = useMemo(() => {
    const curSku = form.getValues("skus")[idx];
    return curSku.skuAttributeValues
      .map(
        (av) =>
          `${attAndAttValHashDeferred.attHash[av.productAttributeId]?.name}: ${
            attAndAttValHashDeferred.attValHash[av.productAttributeValueId]
              ?.name
          }`
      )
      .join(" - ");
  }, [
    attAndAttValHashDeferred.attHash,
    attAndAttValHashDeferred.attValHash,
    form,
    idx,
  ]);

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
  );
})
