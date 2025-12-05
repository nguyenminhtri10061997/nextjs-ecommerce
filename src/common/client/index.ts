"use client"
import { TDictionaryKeys } from "@/app/[lang]/dictionaries"
import { DragEndEvent } from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"
import { ChangeEvent } from "react"
import {
  ArrayPath,
  ControllerRenderProps,
  Path,
  PathValue,
  UseFieldArrayReturn,
  UseFormReturn,
} from "react-hook-form"

export function handleDragEnd<
  TForm extends Record<string, unknown>,
  TKey extends ArrayPath<TForm>,
>(
  form: UseFormReturn<TForm>,
  key: TKey,
  arrField: UseFieldArrayReturn<TForm, TKey>
) {
  return (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      const optionVals = form.getValues(key)
      const oldIndex = arrField.fields?.findIndex((i) => i.id === active.id)
      const newIndex = arrField.fields.findIndex((i) => i.id === over?.id)

      if (oldIndex < 0 || newIndex < 0) return

      const attributeValuesMoved = arrayMove(
        optionVals as unknown[],
        oldIndex,
        newIndex
      )

      form.setValue(
        key as Path<TForm>,
        attributeValuesMoved as PathValue<TForm, Path<TForm>>
      )
    }
  }
}

export function alphaToHex(a?: number) {
  if (a == null) {
    return ""
  }
  const hex = Math.round(a * 255)
    .toString(16)
    .padStart(2, "0")
  return hex
}

export const handleNumberChange = (
  e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  onChange: ControllerRenderProps["onChange"]
) => {
  const val = e.target.value
  if (/^\d*$/.test(val)) {
    onChange(val === "" ? "" : Number(val))
  }
}

export type TAppPageProps = React.PropsWithChildren<{
  params: Promise<{ lang: TDictionaryKeys }>
}>

export function debounce<T extends (...args: never[]) => void>(
  fn: T,
  delay = 300
) {
  let timer: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}
