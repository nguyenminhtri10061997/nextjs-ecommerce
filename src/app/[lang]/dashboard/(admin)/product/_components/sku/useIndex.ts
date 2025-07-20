import { UseFormReturn, useWatch } from "react-hook-form";
import { TForm } from "../product-form/useIndex";

type TProps = {
  idx: number;
  form: UseFormReturn<TForm>;
};
export default function useIndex(props: TProps) {
  const { form, idx } = props;

  const stockTypeWatch = useWatch({
    control: form.control,
    name: `skus.${idx}.stockType`,
  });

  return {
    stockTypeWatch,
  };
}
