import { PostCreateBodyDTO } from "@/app/api/product/validator";
import { useGetBrandListQuery } from "@/lib/reactQuery/brand";
import { useGetOptionListQuery } from "@/lib/reactQuery/option";
import { useGetProductCategoryListQuery } from "@/lib/reactQuery/product-category";
import { useGetProductTagListQuery } from "@/lib/reactQuery/product-tag";
import { useMemo } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { output } from "zod/v4";

export type TForm = Omit<output<typeof PostCreateBodyDTO>, 'listImages'> & {
  listImages: { name?: string | null }[];
};

export default function useIndex() {
  const form = useForm<TForm>({
    mode: "onBlur",
    defaultValues: {
      isActive: true,
    }
  });
  const listImageArrField = useFieldArray<TForm, "listImages">({
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

  const productOptionsWatch = useWatch({
    control: form.control,
    name: "productOptions",
  });

  const productTypeWatch = useWatch({
    control: form.control,
    name: "type",
  });

  const productOptionIdSelected = useMemo(
    () =>
      (productOptionsWatch || []).map((i, idx) => ({
        idx,
        optionId: i.optionId,
      })),
    [productOptionsWatch]
  );

  const productTagsWatch = useWatch({
    control: form.control,
    name: "productTags",
  });

  const productTagIdSelected = useMemo(
    () =>
      (productTagsWatch || []).map((i, idx) => ({
        idx,
        productTagId: i.productTagId,
      })),
    [productTagsWatch]
  );

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
    productTagIdSelected,
    productTypeWatch,
  };
}
