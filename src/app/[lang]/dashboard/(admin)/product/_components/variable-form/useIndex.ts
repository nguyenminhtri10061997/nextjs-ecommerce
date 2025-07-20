import { useGetAttributeListQuery } from "@/lib/reactQuery/attribute";
import { useFieldArray, UseFormReturn, useWatch } from "react-hook-form";
import { TForm } from "../product-form/useIndex";
import { useAlertContext } from "@/hooks/useAlertContext";
import { generateCombinations } from "@/common";
import { startTransition, useMemo } from "react";

type TProps = {
  form: UseFormReturn<TForm>;
};
export default function useIndex(props: TProps) {
  const { form } = props;

  const { showAlert } = useAlertContext();

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productAttribute.map((a) => `${a.id}-${a.name}-${a.attributeValues?.length}`)]);

  const handleClickAddSku = () => {
    const att = form.getValues("attributes");
    if (
      !att.length ||
      !att.some((f) => f.name) ||
      !att.some((f) => f.attributeValues.some((v) => v.name))
    ) {
      showAlert(
        "Please Add At Least One Attribute And Attribute Value First",
        "error"
      );
      return;
    }
    skuArrField.append({
      sellerSku: "",
      stockType: "MANUAL",
      stockStatus: "STOCKING",
      price: 0,
      status: "ACTIVE",
      skuAttributeValues: [],
    });
  };

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

  return {
    queryAtt,
    productAttArrField,
    skuArrField,
    attAndAttValHash,
    handleClickAddSku,
    handleClickGenSku,
  };
}
