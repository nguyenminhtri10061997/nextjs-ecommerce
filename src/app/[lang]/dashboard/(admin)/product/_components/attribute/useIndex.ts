import { Prisma } from "@prisma/client";
import { UseQueryResult } from "@tanstack/react-query";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { TForm } from "../product-form/useIndex";

type TProps = {
  form: UseFormReturn<TForm>;
  idx: number;
  queryAtt: UseQueryResult<
    Prisma.AttributeGetPayload<{ include: { attributeValues: true } }>[]
  >;
};
export default function useIndex(props: TProps) {
  const { form, idx, queryAtt } = props;
  const { control } = form;

  const productAttValArrField = useFieldArray({
    control,
    name: `attributes.${idx}.attributeValues`,
  });

  return {
    productAttValArrField,
  };
}
