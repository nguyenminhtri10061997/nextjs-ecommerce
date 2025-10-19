import { PostCreateBodyDTO } from "@/app/api/product/validator";
import useAppUseForm from "@/constants/reactHookForm";
import { useGetBrandListQuery } from "@/lib/reactQuery/brand";
import { useGetOptionListQuery } from "@/lib/reactQuery/option";
import { useGetProductCategoryListQuery } from "@/lib/reactQuery/product-category";
import { useGetProductTagListQuery } from "@/lib/reactQuery/product-tag";
import { useMemo } from "react";
import { useFieldArray, useWatch } from "react-hook-form";
import { output } from "zod/v4";

export type TForm<
  T extends output<typeof PostCreateBodyDTO> = output<typeof PostCreateBodyDTO>
> = Omit<T, "listImages" | "mainImage" | "attributes" | "skus"> & {
  skus: (Omit<T["skus"][number], "image"> & {
    image: { file?: File | null; url?: string | null };
  })[];
  listImages: { file?: File | null; url?: string | null }[];
  mainImage: { file?: File | null; url?: string | null };
  attributes: (Omit<T["attributes"][number], "attributeValues"> & {
    isNew: boolean;
    attributeValues: (Omit<
      T["attributes"][number]["attributeValues"][number],
      "image"
    > & {
      image: { file?: File | null; url?: string | null };
    })[];
  })[];
};

export default function useIndex() {
  const form = useAppUseForm<TForm>();
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
