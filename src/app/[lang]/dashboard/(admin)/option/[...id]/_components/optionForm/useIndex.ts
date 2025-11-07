import { PatchBodyDTO } from "@/app/api/option/[id]/validator"
import { textToSlug } from "@/common"
import useAppUseForm from "@/constants/reactHookForm"
import { ChangeEvent } from "react"
import { useFieldArray } from "react-hook-form"
import { output } from "zod/v4"

export type TForm = output<typeof PatchBodyDTO>

export default function useIndex() {
  const form = useAppUseForm<TForm>()
  const optionValueArrField = useFieldArray({
    control: form.control,
    name: "optionItems",
  })

  const handleRemoveOpItemValue = (idx: number) => () => {
    optionValueArrField.remove(idx)
  }

  const handleAddOpItemValue = () => {
    optionValueArrField.append({
      name: "",
      slug: "",
      displayOrder: null,
      isActive: true,
    })
  }

  const handleChangeOpItemValue =
    (
      idx: number,
      cbOfField: (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ) => void
    ) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const val = e.target.value

      form.setValue(`optionItems.${idx}.slug`, textToSlug(val))
      cbOfField(e)
    }

  return {
    form,
    optionValueArrField,
    handleRemoveOpItemValue,
    handleAddOpItemValue,
    handleChangeOpItemValue,
  }
}
