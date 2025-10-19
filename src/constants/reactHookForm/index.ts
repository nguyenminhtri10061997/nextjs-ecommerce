import { FieldValues, useForm, UseFormProps } from "react-hook-form";

const useAppUseForm = <
  TFieldValues extends FieldValues = FieldValues,
  TContext = unknown,
  TTransformedValues = TFieldValues
>(
  props?: UseFormProps<TFieldValues, TContext, TTransformedValues>
) =>
  useForm({
    mode: "onBlur",
    ...props,
  });

export default useAppUseForm;
