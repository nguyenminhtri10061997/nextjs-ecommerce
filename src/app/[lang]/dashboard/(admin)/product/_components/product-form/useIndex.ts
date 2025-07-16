import {
  PostCreateBodyDTO,
  ProductToOptionDTO,
} from "@/app/api/product/validator";
import { useGetBrandListQuery } from "@/lib/reactQuery/brand";
import { useGetOptionListQuery } from "@/lib/reactQuery/option";
import { useGetProductCategoryListQuery } from "@/lib/reactQuery/product-category";
import { useGetProductTagListQuery } from "@/lib/reactQuery/product-tag";
import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useMemo } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { output } from "zod/v4";

export type TForm = Omit<
  Partial<output<typeof PostCreateBodyDTO>>,
  "productOptions" | "listImages" | "mainImage"
> & {
  productOptions: (output<typeof ProductToOptionDTO> & {
    idDnD: string;
  })[];
  listImages: { file?: File | null; url?: string | null }[];
  mainImage: { file?: File | null; url?: string | null };
};

export default function useIndex() {
  const form = useForm<TForm>({
    mode: "onBlur",
  });
  const listImageArrField = useFieldArray({
    control: form.control,
    name: "listImages",
  });

  const productTagArrField = useFieldArray({
    control: form.control,
    name: "productTags",
  });

  const productOptionArrField = useFieldArray({
    control: form.control,
    name: "productOptions",
  });
  const queryBrand = useGetBrandListQuery({});
  const queryCategory = useGetProductCategoryListQuery({});
  const queryProductTag = useGetProductTagListQuery({});
  const queryOption = useGetOptionListQuery({});

  const getProductTagIdSelected = () => {
    return form
      .getValues("productTags")
      ?.map((i) => i.productTagId)
      .filter(Boolean);
  };

  const productOptionsWatch = useWatch({
    control: form.control,
    name: "productOptions",
  });

  const productOptionIdSelected = useMemo(
    () => (productOptionsWatch || []).map((i) => i.optionId),
    [productOptionsWatch]
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const optionVals = form.getValues("productOptions");
      const oldIndex = optionVals?.findIndex((i) => i.idDnD === active.id);
      const newIndex = optionVals.findIndex((i) => i.idDnD === over?.id);

      const attributeValuesMoved = arrayMove(optionVals, oldIndex, newIndex);
      form.setValue("productOptions", attributeValuesMoved);
    }
  };

  return {
    form,
    queryBrand,
    queryCategory,
    queryProductTag,
    queryOption,
    productTagArrField,
    listImageArrField,
    productOptionArrField,
    productOptionIdSelected,
    getProductTagIdSelected,
    handleDragEnd,
  };
}
