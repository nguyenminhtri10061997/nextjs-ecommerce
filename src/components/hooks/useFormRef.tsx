import { FormEvent, useRef } from "react";
import { FieldValues, SubmitHandler, UseFormReturn } from "react-hook-form";

type TProps<T> = {
  handleFormSubmit: SubmitHandler<T>
}

export default function useFormRef<T extends FieldValues>(props: TProps<T>) {
  const formRef = useRef<UseFormReturn<T>>(null);

  const handleSetForm = (form: UseFormReturn<T>) => {
    formRef.current = form;
  };

  const handleClickSubmitForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    formRef.current?.handleSubmit(props.handleFormSubmit)(e);
  };


  return {
    formRef,
    handleSetForm,
    handleClickSubmitForm,
  }
}