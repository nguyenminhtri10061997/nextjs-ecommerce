import { PostCreateBodyDTO } from "@/app/api/attribute/validator";
import { textToSlug } from "@/common";
import { AttributeValue } from "@prisma/client";
import { ChangeEvent } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { v4 } from "uuid";
import { output } from "zod/v4";

export type TForm = (Omit<output<typeof PostCreateBodyDTO>, "attributeValues">) & {
  attributeValues: (
    Pick<AttributeValue, "name" | "slug">
    & { idDnD: string }
  )[];
};

export default function useIndex() {
  const form = useForm<TForm>({
    mode: "onBlur",
  });
  const attributeValueArrField = useFieldArray({
    control: form.control,
    name: "attributeValues",
  });

  const handleRemoveAttValue = (idx: number) => () => {
    attributeValueArrField.remove(idx);
  };

  const handleAddAttValue = () => {
    attributeValueArrField.append({
      idDnD: v4(),
      name: "",
      slug: "",
    });
  };

  const handleChangeAttValue =
    (
      idx: number,
      cbOfField: (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ) => void
    ) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const val = e.target.value;

      form.setValue(`attributeValues.${idx}.slug`, textToSlug(val));
      cbOfField(e);
    };

  return {
    form,
    attributeValueArrField,
    handleRemoveAttValue,
    handleAddAttValue,
    handleChangeAttValue,
  };
}
