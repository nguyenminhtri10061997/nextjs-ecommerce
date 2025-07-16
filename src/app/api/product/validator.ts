import { z } from "zod/v4";
import {
  DateRangeQueryDTO,
  OrderQueryDTO,
  PagingQueryDTO,
  SearchQueryDTO,
} from "@/lib/zod/paginationDTO";
import {
  EAttributeStatus,
  EAttributeValueStatus,
  EPriceModifierType,
  ESkuStatus,
  EStockType,
  Product,
} from "@prisma/client";

const ProductAttributeValueDTO = z.object({
  name: z.string(),
  slug: z.string(),
  image: z.string().optional(),
  displayOrder: z.number().nonnegative().nullable().optional(),
  status: z.enum([
    EAttributeValueStatus.ACTIVE,
    EAttributeValueStatus.INACTIVE_BY_ADMIN,
  ]),
});

const ProductAttributeDTO = z.object({
  name: z.string(),
  slug: z.string(),
  image: z.string().optional(),
  displayOrder: z.number().nonnegative().nullable().optional(),
  status: z.enum([EAttributeStatus.ACTIVE, EAttributeStatus.INACTIVE_BY_ADMIN]),
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
    sellerSku: z.string(),
    stockStatus: z.enum(EStockType).optional(),
    stockType: z.enum(EStockType),
    salePrice: z.number().min(0).optional(),
    price: z.number().min(0),
    costPrice: z.number().min(0).optional(),
    stock: z.number().optional(),
    barcode: z.string().optional(),
    weight: z.number().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
    length: z.number().optional(),
    note: z.string().optional(),
    status: z.enum(ESkuStatus),
    isDefault: z.boolean().optional(),
    displayOrder: z.number().nonnegative().nullable().optional(),
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
});

export const ProductToOptionDTO = z.object({
  optionId: z.uuid(),
  displayOrder: z.number().nonnegative().nullable().optional(),
  isRequired: z.boolean().optional(),
  maxSelect: z.number().nonnegative().nullable(),
  optionItems: z.array(ProductToOptionToOptionItemDTO).optional(),
});

const ProductTagDTO = z.object({
  productTagId: z.uuid(),
  expiredAt: z.date().min(new Date()).optional(),
});

// API

export const GetQueryDTO = z.object({
  pagination: PagingQueryDTO.shape.pagination.optional(),
  orderQuery: OrderQueryDTO([
    "createdAt",
    "updatedAt",
  ] as (keyof Product)[]).shape.orderQuery.optional(),
  searchQuery: SearchQueryDTO([
    "name",
  ] as (keyof Product)[]).shape.searchQuery.optional(),
  dateRangeQuery: DateRangeQueryDTO.shape.dateRangeQuery.optional(),
});

export const PostCreateBodyDTO = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  slug: z.string().min(1),
  seoTitle: z.string().optional(),
  description: z.string().optional(),
  seoDescription: z.string().optional(),
  productCategoryId: z.uuid().optional().nullable(),
  brandId: z.uuid().optional().nullable(),
  detail: z.string().optional(),
  mainImage: z.file(),
  listImages: z.array(z.file()).optional(),
  viewCount: z.number().nonnegative().optional(),
  soldCount: z.number().nonnegative().optional(),
  isActive: z.boolean().optional(),
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
  attributes: z.array(ProductAttributeDTO),
  skus: z.array(ProductSkuDTO),
});

export const DeleteBodyDTO = z.object({
  ids: z.array(z.uuid()),
});
