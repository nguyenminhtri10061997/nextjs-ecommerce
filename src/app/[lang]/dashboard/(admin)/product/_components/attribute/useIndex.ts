import { EAttributeStatus, Prisma } from "@prisma/client";
import { UseQueryResult } from "@tanstack/react-query";
import { useMemo } from "react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { v4 } from "uuid";
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

  const optMemo = useMemo(() => {
    return queryAtt.data?.map((i) => i.name) || [];
  }, [queryAtt.data]);

  const handleFillAttValsByExistAtt = (attName: string) => {
    const found = queryAtt.data?.find((d) => d.name === attName);
    form.setValue(
      `attributes.${idx}.attributeValues`,
      found!.attributeValues.map((atv) => ({
        id: v4(),
        name: atv.name,
        slug: atv.slug,
        status: EAttributeStatus.ACTIVE,
      }))
    );
  };

  return {
    optMemo,
    productAttValArrField,
    handleFillAttValsByExistAtt,
  };
}
