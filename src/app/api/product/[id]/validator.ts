import { EPriceModifierType, ESkuStatus, EStockStatus, EStockType } from "@prisma/client";
import { z } from "zod/v4";

export const IdParamsDTO = z.object({
  id: z.uuid(),
});

const TranslationDTO = z.object({
  languageId: z.uuid(),
  name: z.string().optional(),
  slug: z.string().optional(),
  seoTitle: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  seoDescription: z.string().nullable().optional(),
  detail: z.string().nullable().optional(),
});

const ProductAttributeValueDTO = z.object({
  id: z.uuid(),
  name: z.string(),
  slug: z.string(),
  image: z.string().optional(),
  displayOrder: z.number().nonnegative().nullable().optional(),
});

const ProductAttributeDTO = z.object({
  id: z.uuid(),
  name: z.string(),
  slug: z.string(),
  image: z.string().optional(),
  displayOrder: z.number().nonnegative().nullable().optional(),
  attributeValues: z.array(ProductAttributeValueDTO),
});

const ProductSkuAttributeValue = z.object({
  productAttributeId: z.string(),
  productAttributeValueId: z.string(),
  image: z.string().optional(),
  Label: z.string().optional(),
});

const ProductSkuDTO = z
  .object({
    id: z.uuid(),
    sellerSku: z.string().optional(),
    stockStatus: z.enum(EStockStatus),
    stockType: z.enum(EStockType),
    salePrice: z.number().min(0),
    price: z.number().min(0),
    costPrice: z.number().min(0),
    stock: z.number(),
    barcode: z.string(),
    weight: z.number(),
    width: z.number(),
    height: z.number(),
    length: z.number(),
    note: z.string(),
    status: z.enum(ESkuStatus),
    isDefault: z.boolean(),
    displayOrder: z.number().nonnegative().nullable(),
    skuAttributeValues: ProductSkuAttributeValue,
  })
  .check((ctx) => {
    if (ctx.value.stockType === "EXTERNAL") {
      ctx.issues.push({
        code: "custom",
        input: ctx.value.stockStatus,
        path: ["stockStatus"],
        message: "stockStatus is required if stockType is EXTERNAL",
      });
    }
  });

const ProductToOptionToOptionItemDTO = z.object({
  optionItemId: z.uuid(),
  displayOrder: z.number().nonnegative().nullable().optional(),
  priceModifierType: z.enum(EPriceModifierType),
  priceModifierValue: z.number(),
})

const ProductToOptionDTO = z.object({
  optionId: z.uuid(),
  displayOrder: z.number().nonnegative().nullable().optional(),
  isRequired: z.boolean().optional(),
  maxSelect: z.number().nonnegative(),
  optionItems: z.array(ProductToOptionToOptionItemDTO).optional()
});

const ProductTagDTO = z.object({
  productTagId: z.uuid(),
  expiredAt: z.date().min(new Date()).nullable().optional(),
});

// API
export const PatchUpdateBodyDTO = z.object({
  productCategoryId: z.uuid().optional().nullable(),
  brandId: z.uuid().optional(),
  code: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  seoTitle: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  seoDescription: z.string().nullable().optional(),
  detail: z.string().nullable().optional(),
  mainImage: z.string().nullable().optional(),
  listImages: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
  viewCount: z.number().nonnegative().optional(),
  soldCount: z.number().nonnegative().optional(),

  attributes: z.array(ProductAttributeDTO),
  skus: z.array(ProductSkuDTO),
  translations: z.array(TranslationDTO).optional(),
  productTags: z.array(ProductTagDTO).optional(),
  productOptions: z.array(ProductToOptionDTO).optional(),
});
