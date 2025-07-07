import { textToSlug } from "@/common"
import { Attribute, AttributeValue } from "@prisma/client"
import { ChangeEvent } from "react"
import { useFieldArray, useForm } from "react-hook-form"

export type TForm = Pick<Attribute, 'name' | 'slug'> & { attributeValues: Pick<AttributeValue, 'name' | 'slug'>[] }

export default () => {
    const form = useForm<TForm>({
        mode: 'onBlur',
    })
    const attributeValueArrField = useFieldArray({
        control: form.control,
        name: "attributeValues",
    })

    const handleRemoveAttValue = (idx: number) => () => {
        attributeValueArrField.remove(idx)
    }

    const handleAddAttValue = () => {
        attributeValueArrField.append({
            name: "",
            slug: ""
        })
    }

    const handleChangeAttValue = (idx: number, cbOfField: Function) => (e:ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const val = e.target.value

        form.setValue(`attributeValues.${idx}.slug`, textToSlug(val))
        cbOfField(e)
    }

    return {
        form,
        attributeValueArrField,
        handleRemoveAttValue,
        handleAddAttValue,
        handleChangeAttValue,
    }
}