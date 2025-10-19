import {
  EAttributeStatus,
  EAttributeValueStatus,
  EPriceModifierType,
  ESkuStatus,
  EStockStatus,
  EStockType,
} from "@prisma/client";
import { z } from "zod/v4";

export const IdParamsDTO = z.object({
  id: z.uuid(),
});

export const ProductAttributeValueDTO = z.object({
  id: z.uuid(),
  name: z.string().optional(),
  slug: z.string().optional(),
  image: z.string().optional(),
  isDefault: z.boolean().optional(),
  displayOrder: z.number().nonnegative().nullable().optional(),
  status: z.enum([
    EAttributeValueStatus.ACTIVE,
    EAttributeValueStatus.INACTIVE_BY_ADMIN,
  ]),
});

export const ProductAttributeDTO = z.object({
  id: z.uuid(),
  name: z.string(),
  slug: z.string(),
  status: z.enum([EAttributeStatus.ACTIVE, EAttributeStatus.INACTIVE_BY_ADMIN]),
  displayOrder: z.number().nonnegative().nullable().optional(),
  attributeValues: z.array(ProductAttributeValueDTO),
  isUsedForVariations: z.boolean().optional(),
});

const ProductSkuAttributeValue = z.object({
  productAttributeId: z.string(),
  productAttributeValueId: z.string(),
  image: z.string().optional(),
});

export const ProductSkuDTO = z
  .object({
    id: z.uuid(),
    sellerSku: z.string().optional(),
    stockStatus: z.enum(EStockStatus).nullable().optional(),
    stockType: z.enum(EStockType),
    image: z.string().nullable().optional(),
    salePrice: z.number().min(0).nullable().optional(),
    price: z.number().min(0),
    costPrice: z.number().min(0).nullable().optional(),
    barcode: z.string().nullable().optional(),
    stock: z.number().nullable().optional(),
    downloadUrl: z.string().nullable().optional(),
    note: z.string().nullable().optional(),
    weight: z.number().nullable().optional(),
    width: z.number().nullable().optional(),
    length: z.number().nullable().optional(),
    height: z.number().nullable().optional(),
    displayOrder: z.number().nonnegative().nullable(),
    status: z.enum(ESkuStatus).optional(),
    skuAttributeValues: z.array(ProductSkuAttributeValue),
  })
  .check((ctx) => {
    switch (ctx.value.stockType) {
      case "MANUAL":
        if (!ctx.value.stockStatus) {
          ctx.issues.push({
            code: "custom",
            input: ctx.value.stockStatus,
            path: ["stockStatus"],
            message: "stockStatus is required if stockType is EXTERNAL",
          });
        }
        break;
      case "INVENTORY":
        if (!ctx.value.stock) {
          ctx.issues.push({
            code: "custom",
            input: ctx.value.stock,
            path: ["stock"],
            message: "stock is required if stockType is EXTERNAL",
          });
        }
        break;
      case "DIGITAL":
        if (!ctx.value.downloadUrl) {
          ctx.issues.push({
            code: "custom",
            input: ctx.value.downloadUrl,
            path: ["downloadUrl"],
            message: "downloadUrl is required if stockType is DIGITAL",
          });
        }
        break;
      case "ATTRIBUTE":
        if (!ctx.value.skuAttributeValues.length) {
          ctx.issues.push({
            code: "custom",
            input: ctx.value.skuAttributeValues,
            path: ["skuAttributeValues"],
            message: "skuAttributeValues is required if stockType is ATTRIBUTE",
          });
        }
        break;
      default:
        break;
    }
  });

const ProductToOptionToOptionItemDTO = z.object({
  optionItemId: z.uuid(),
  displayOrder: z.number().nonnegative().nullable(),
  priceModifierType: z.enum(EPriceModifierType),
  priceModifierValue: z.number(),
});

export const ProductToOptionDTO = z.object({
  optionId: z.uuid(),
  displayOrder: z.number().nonnegative().nullable(),
  isRequired: z.boolean(),
  maxSelect: z.number().nonnegative(),
  optionItems: z.array(ProductToOptionToOptionItemDTO),
});

export const ProductTagDTO = z.object({
  productTagId: z.uuid(),
  expiredAt: z.date().min(new Date()).nullable().optional(),
});

// API
export const PatchUpdateBodyDTO = z.object({
  productCategoryId: z.uuid().optional().nullable(),
  brandId: z.uuid().optional().nullable(),
  code: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  seoTitle: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  seoDescription: z.string().nullable().optional(),
  detail: z.string().nullable().optional(),
  mainImage: z.string().nullable().optional(),
  listImages: z.array(z.string()).optional(),
  viewCount: z.number().nonnegative().optional(),
  soldCount: z.number().nonnegative().optional(),
  avgRateByAdmin: z.number().nonnegative().optional(),
  isActive: z.boolean().optional(),

  attributes: z.array(ProductAttributeDTO).optional(),
  productTags: z
    .array(ProductTagDTO)
    .check((ctx) => {
      const ids = ctx.value.map((i) => i.productTagId);
      if (new Set(ids).size !== ids.length) {
        ctx.issues.push({
          code: "custom",
          input: ctx.value,
          path: ["productTags"],
          message: "Array must contain unique productTagId",
        });
      }
    })
    .optional(),
  productOptions: z
    .array(ProductToOptionDTO)
    .check((ctx) => {
      const ids = ctx.value.map((i) => i.optionId);
      if (new Set(ids).size !== ids.length) {
        ctx.issues.push({
          code: "custom",
          input: ctx.value,
          path: ["productOptions"],
          message: "Array must contain unique optionId",
        });
      }
    })
    .optional(),
  skus: z.array(ProductSkuDTO).optional(),
});
