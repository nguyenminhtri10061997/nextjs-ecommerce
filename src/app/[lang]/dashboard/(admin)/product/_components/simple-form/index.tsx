import { UseFormReturn } from "react-hook-form";
import Sku from "../sku";
import { TForm } from "../product-form/useIndex";

type TProps = {
  form: UseFormReturn<TForm>;
};
export default function Index(props: TProps) {
  const { form } = props;

  return <Sku form={form} idx={0} />;
}
