import { generateCombinations } from "@/common";
import { useGetAttributeListQuery } from "@/lib/reactQuery/attribute";
import { startTransition, useMemo } from "react";
import { useFieldArray, UseFormReturn, useWatch } from "react-hook-form";
import { TForm } from "../product-form/useIndex";

type TProps = {
  form: UseFormReturn<TForm>;
};
export default function useIndex(props: TProps) {
  const { form } = props;

  const queryAtt = useGetAttributeListQuery({});

  const productAttArrField = useFieldArray({
    control: form.control,
    name: "attributes",
  });

  const skuArrField = useFieldArray({
    control: form.control,
    name: "skus",
  });

  const productAttribute = useWatch({
    control: form.control,
    name: "attributes",
  });

  const attAndAttValHash = useMemo(() => {
    const res: {
      attHash: { [key: string]: TForm["attributes"][number] };
      attValHash: {
        [key: string]: TForm["attributes"][number]["attributeValues"][number];
      };
    } = {
      attHash: {},
      attValHash: {},
    };
    productAttribute.forEach((att) => {
      res.attHash[att.id!] = att;
      att.attributeValues.forEach((attV) => {
        res.attValHash[attV.id!] = attV;
      });
    });
    return res;
  }, [productAttribute]);

  const handleClickGenSku = () => {
    startTransition(() => {
      const att = form.getValues("attributes");
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
    attAndAttValHash,
    handleClickGenSku,
    handleClickDeleteSku,
  };
}
