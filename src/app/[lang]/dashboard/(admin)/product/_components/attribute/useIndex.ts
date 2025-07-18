import { useFieldArray, UseFormReturn } from "react-hook-form";
import { TForm } from "../product-form/useIndex";

type TProps = {
  form: UseFormReturn<TForm>;
  idx: number;
};
export default function useIndex(props: TProps) {
  const { form, idx } = props;
  const { control } = form;

  const productAttValArrField = useFieldArray({
    control,
    name: `attributes.${idx}.attributeValues`,
  });

  return {
    productAttValArrField,
  };
}
