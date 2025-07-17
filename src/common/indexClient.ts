"use client";
import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import {
  ArrayPath,
  Path,
  PathValue,
  UseFieldArrayReturn,
  UseFormReturn,
} from "react-hook-form";

export function handleDragEnd<
  TForm extends Record<string, unknown>,
  TKey extends ArrayPath<TForm>
>(
  form: UseFormReturn<TForm>,
  key: TKey,
  arrField: UseFieldArrayReturn<TForm, TKey>
) {
  return (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const optionVals = form.getValues(key);
      const oldIndex = arrField.fields?.findIndex((i) => i.id === active.id);
      const newIndex = arrField.fields.findIndex((i) => i.id === over?.id);

      if (oldIndex < 0 || newIndex < 0) return;

      const attributeValuesMoved = arrayMove(
        optionVals as unknown[],
        oldIndex,
        newIndex
      );

      console.log({
        attributeValuesMoved, key
      })

      form.setValue(
        key as Path<TForm>,
        attributeValuesMoved as PathValue<TForm, Path<TForm>>
      );
    }
  };
}
