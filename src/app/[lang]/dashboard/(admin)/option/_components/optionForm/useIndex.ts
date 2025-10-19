import { textToSlug } from "@/common/client";
import useAppUseForm from "@/constants/reactHookForm";
import { Option, OptionItem } from "@prisma/client";
import { ChangeEvent } from "react";
import { useFieldArray } from "react-hook-form";
import { v4 } from "uuid";

export type TForm = Pick<
  Option,
  "name" | "slug" | "displayOrder" | "isActive"
> & {
  optionItems: (Pick<
    OptionItem,
    "name" | "slug" | "displayOrder" | "isActive"
  > & { idDnD: string })[];
};

export default function useIndex() {
  const form = useAppUseForm<TForm>({
    defaultValues: {
      isActive: true,
    },
  });
  const optionValueArrField = useFieldArray({
    control: form.control,
    name: "optionItems",
  });

  const handleRemoveOpItemValue = (idx: number) => () => {
    optionValueArrField.remove(idx);
  };

  const handleAddOpItemValue = () => {
    optionValueArrField.append({
      idDnD: v4(),
      name: "",
      slug: "",
      displayOrder: null,
      isActive: true,
    });
  };

  const handleChangeOpItemValue =
    (
      idx: number,
      cbOfField: (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ) => void
    ) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const val = e.target.value;

      form.setValue(`optionItems.${idx}.slug`, textToSlug(val));
      cbOfField(e);
    };

  return {
    form,
    optionValueArrField,
    handleRemoveOpItemValue,
    handleAddOpItemValue,
    handleChangeOpItemValue,
  };
}
