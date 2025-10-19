import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { ChangeEvent } from "react";
import {
  ArrayPath,
  ControllerRenderProps,
  Path,
  PathValue,
  UseFieldArrayReturn,
  UseFormReturn,
} from "react-hook-form";

export const textToSlug = (text: string): string => {
  return text
    .normalize("NFD") // tách dấu Unicode (vd: "ấ" => "a" + "̂" + "́")
    .replace(/[\u0300-\u036f]/g, "") // xoá các ký tự dấu
    .toLowerCase() // viết thường
    .trim() // xoá khoảng trắng đầu/cuối
    .replace(/[^a-z0-9\s-]/g, "") // xoá ký tự đặc biệt, giữ lại chữ, số, khoảng trắng và dấu "-"
    .replace(/\s+/g, "-") // thay khoảng trắng bằng "-"
    .replace(/-+/g, "-"); // xoá dấu "-" lặp lại
};

export function alphaToHex(a?: number) {
  if (a == null) {
    return "";
  }
  const hex = Math.round(a * 255)
    .toString(16)
    .padStart(2, "0");
  return hex;
}

export const handleNumberChange = (
  e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  onChange: ControllerRenderProps["onChange"]
) => {
  const val = e.target.value;
  if (/^\d*$/.test(val)) {
    onChange(val === "" ? "" : Number(val));
  }
};

export function generateCombinations<T>(arrays: Array<T[]>) {
  return arrays.reduce<T[][]>(
    (acc, curr) => {
      const result: T[][] = [];
      for (const item of acc) {
        for (const val of curr) {
          result.push([...item, val]);
        }
      }
      return result;
    },
    [[]]
  );
}

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

      form.setValue(
        key as Path<TForm>,
        attributeValuesMoved as PathValue<TForm, Path<TForm>>
      );
    }
  };
}
