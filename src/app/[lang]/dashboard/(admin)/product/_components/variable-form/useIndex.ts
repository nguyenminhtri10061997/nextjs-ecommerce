import { generateCombinations } from "@/common";
import { useAlertContext } from "@/hooks/useAlertContext";
import { useGetAttributeListQuery } from "@/lib/reactQuery/attribute";
import { startTransition, useDeferredValue, useState } from "react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { TForm } from "../product-form/useIndex";

export type TAttValHash = {
  attHash: { [key: string]: TForm["attributes"][number] };
  attValHash: {
    [key: string]: TForm["attributes"][number]["attributeValues"][number];
  };
};

type TProps = {
  form: UseFormReturn<TForm>;
};
export default function useIndex(props: TProps) {
  const { form } = props;

  const queryAtt = useGetAttributeListQuery({
    orderQuery: {
      orderKey: "displayOrder",
      orderType: "asc",
    },
  });
  const { showAlert } = useAlertContext();
  const [attAndAttValHash, setAttAndAttValHash] = useState<TAttValHash>({
    attHash: {},
    attValHash: {},
  });

  const attAndAttValHashDeferred = useDeferredValue(attAndAttValHash);

  const productAttArrField = useFieldArray({
    control: form.control,
    name: "attributes",
  });

  const skuArrField = useFieldArray({
    control: form.control,
    name: "skus",
  });

  const handleClickGenSku = async () => {
    const att = form.getValues("attributes");
    if (!att.length) {
      showAlert("Please add at least one Attribute", "error");
      return;
    }
    const isValid = await form.trigger(
      form
        .getValues("attributes")
        .flatMap((at, idx) => [
          `attributes.${idx}.name`,
          `attributes.${idx}.slug`,
          `attributes.${idx}.status`,
          ...at.attributeValues.flatMap((_, idxV) => [
            `attributes.${idx}.attributeValues.${idxV}.name`,
            `attributes.${idx}.attributeValues.${idxV}.slug`,
          ]),
        ]) as Parameters<typeof form.trigger>[0]
    );
    if (!isValid) {
      return;
    }
    startTransition(() => {
      const resCombination = generateCombinations(
        att
          .filter((i) => i.name)
          .map((i) => {
            return i.attributeValues
              .filter((v) => v.name)
              .map((v) => ({
                attributeId: i.id,
                ...v,
              }));
          })
      );

      form.setValue(
        "skus",
        resCombination.map(
          (attVs) =>
            ({
              price: 0,
              stockType: "MANUAL",
              stockStatus: 'STOCKING',
              status: "ACTIVE",
              skuAttributeValues: attVs.map((v) => ({
                productAttributeId: v.attributeId,
                productAttributeValueId: v.id,
              })),
            } as TForm["skus"][number])
        )
      );
    });
  };

  const handleClickDeleteSku = (idx: number) => {
    skuArrField.remove(idx);
  };

  return {
    queryAtt,
    productAttArrField,
    skuArrField,
    attAndAttValHashDeferred,
    setAttAndAttValHash,
    handleClickGenSku,
    handleClickDeleteSku,
  };
}
