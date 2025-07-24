import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { EPriceModifierType, Prisma } from "@prisma/client";
import { UseQueryResult } from "@tanstack/react-query";
import { startTransition, useDeferredValue, useEffect, useState } from "react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
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

  const [productOIIdSelected, setProductOIIdSelected] = useState<
    (string | null)[]
  >([]);
  const productOIIdSelectedDeferred = useDeferredValue(productOIIdSelected);

  useEffect(() => {
    const callbackSub = form.subscribe({
      name: `productOptions.${idx}.optionItems`,
      formState: {
        values: true,
      },
      callback: (ctx) => {
        setProductOIIdSelected(
          ctx.values.productOptions?.[idx].optionItems?.map(
            (i) => i.optionItemId
          ) || []
        );
      },
    });
    return () => callbackSub();
  }, [form, idx]);

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

  const handleFillDefaultOption = (id: string, idxOpt: number) => {
    const found = queryOption.data?.find((i) => i.id === id);
    if (found) {
      startTransition(() => {
        form.setValue(
          `productOptions.${idxOpt}.optionItems`,
          found.optionItems.map((i) => ({
            optionItemId: i.id,
            priceModifierType: EPriceModifierType.FREE,
            priceModifierValue: 0,
          }))
        );
      });
    }
  };

  return {
    productOptionItemArrField,
    productOIIdSelectedDeferred,
    handleDragEnd,
    handleFillDefaultOption,
  };
}
