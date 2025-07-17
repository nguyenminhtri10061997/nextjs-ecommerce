import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Prisma } from "@prisma/client";
import { UseQueryResult } from "@tanstack/react-query";
import { startTransition, useEffect, useMemo } from "react";
import { useFieldArray, UseFormReturn, useWatch } from "react-hook-form";
import { TForm } from "../product-form/useIndex";

type TProps = {
  form: UseFormReturn<TForm>;
  idx: number;
  queryOption: UseQueryResult<
    Prisma.OptionGetPayload<{ include: { optionItems: true } }>[],
    Error
  >;
};
export default function useIndex(props: TProps) {
  const { form, idx, queryOption } = props;
  const { control } = form;

  const productOptionItemArrField = useFieldArray({
    control,
    name: `productOptions.${idx}.optionItems`,
  });

  const productOIsWatch = useWatch({
    control: form.control,
    name: `productOptions.${idx}.optionItems`,
  });

  const productOIIdSelected = useMemo(
    () =>
      (productOIsWatch || []).map((i, idx) => ({
        idx,
        optionItemId: i.optionItemId,
      })),
    [productOIsWatch]
  );

  const optionIdWatch = useWatch({
    control: form.control,
    name: `productOptions.${idx}.optionId`,
  });

  useEffect(() => {
    if (!productOptionItemArrField.fields.length) {
      startTransition(() => {
        queryOption.data
          ?.find((i) => i.id === optionIdWatch)
          ?.optionItems?.forEach((oi) => {
            productOptionItemArrField.append({
              optionItemId: oi.id,
              priceModifierType: "FREE",
              priceModifierValue: 0,
            });
          });
      });
    }
  }, [optionIdWatch, productOptionItemArrField, queryOption.data]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const optionVals =
        form.getValues(`productOptions.${idx}.optionItems`) || [];
      const oldIndex = productOptionItemArrField?.fields.findIndex(
        (i) => i.id === active.id
      );
      const newIndex = productOptionItemArrField.fields.findIndex(
        (i) => i.id === over?.id
      );

      const attributeValuesMoved = arrayMove(optionVals, oldIndex, newIndex);
      form.setValue(`productOptions.${idx}.optionItems`, attributeValuesMoved);
    }
  };

  return {
    productOptionItemArrField,
    productOIIdSelected,
    optionIdWatch,
    handleDragEnd,
  };
}
