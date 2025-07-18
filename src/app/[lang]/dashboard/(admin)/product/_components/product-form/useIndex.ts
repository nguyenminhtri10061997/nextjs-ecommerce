import { PostCreateBodyDTO } from "@/app/api/product/validator";
import { useGetAttributeListQuery } from "@/lib/reactQuery/attribute";
import { useGetBrandListQuery } from "@/lib/reactQuery/brand";
import { useGetOptionListQuery } from "@/lib/reactQuery/option";
import { useGetProductCategoryListQuery } from "@/lib/reactQuery/product-category";
import { useGetProductTagListQuery } from "@/lib/reactQuery/product-tag";
import { useMemo } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { output } from "zod/v4";

export type TForm<
  T extends output<typeof PostCreateBodyDTO> = output<typeof PostCreateBodyDTO>
> = Omit<T, "listImages" | "mainImage" | "attributes"> & {
  listImages: { file?: File | null; url?: string | null }[];
  mainImage: { file?: File | null; url?: string | null };
  attributes: (Omit<T["attributes"][number], "attributeValues"> & {
    attributeValues: (Omit<
      T["attributes"][number]["attributeValues"][number],
      "image"
    > & {
      image: { file?: File | null; url?: string | null };
    })[];
  })[];
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

  const productAttArrField = useFieldArray({
    control: form.control,
    name: "attributes",
  });


  const skusArrField = useFieldArray({
    control: form.control,
    name: "skus",
  });

  const queryBrand = useGetBrandListQuery({});
  const queryCategory = useGetProductCategoryListQuery({});
  const queryProductTag = useGetProductTagListQuery({});
  const queryOption = useGetOptionListQuery({});
  const queryAtt = useGetAttributeListQuery({});

  const productOptionsWatch = useWatch({
    control: form.control,
    name: "productOptions",
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
    productAttArrField,
    skusArrField,
    productOptionArrField,
    productOptionIdSelected,
    productTagIdSelected,
    queryAtt,
  };
}
