import { z } from "zod/v4";
import {
  DateRangeQueryDTO,
  OrderQueryDTO,
  PagingQueryDTO,
  SearchQueryDTO,
} from "@/lib/zod/paginationDTO";
import {
  EAttributeStatus,
  EAttributeType,
  EAttributeValueStatus,
  EPriceModifierType,
  EProductType,
  ESkuStatus,
  EStockStatus,
  EStockType,
  Product,
} from "@prisma/client";

const ProductAttributeValueDTO = z.object({
  id: z.uuid().optional(),
  name: z.string(),
  slug: z.string(),
  image: z.string().nullable().optional(),
  displayOrder: z.number().nonnegative().nullable().optional(),
  status: z.enum([
    EAttributeValueStatus.ACTIVE,
    EAttributeValueStatus.INACTIVE_BY_ADMIN,
  ]),
});

const ProductAttributeDTO = z.object({
  id: z.uuid().optional(),
  name: z.string(),
  type: z.enum(EAttributeType),
  slug: z.string(),
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
    sellerSku: z.string().nullable().optional(),
    price: z.number().min(0),
    salePrice: z.number().min(0).nullable().optional(),
    costPrice: z.number().min(0).nullable().optional(),
    barcode: z.string().nullable().optional(),
    stockType: z.enum(EStockType),
    stock: z.number().nullable().optional(),
    image: z.string().nullable().optional(),
    downloadUrl: z.string().nullable().optional(),
    stockStatus: z.enum(EStockStatus).nullable().optional(),
    note: z.string().nullable().optional(),
    weight: z.number().nullable().optional(),
    width: z.number().nullable().optional(),
    length: z.number().nullable().optional(),
    height: z.number().nullable().optional(),
    displayOrder: z.number().nonnegative().nullable().optional(),
    status: z.enum(ESkuStatus),
    isDefault: z.boolean().optional(),
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
  displayOrder: z.number().nonnegative().nullable().optional(),
  priceModifierType: z.enum(EPriceModifierType),
  priceModifierValue: z.number(),
});

const ProductToOptionDTO = z.object({
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
  seoTitle: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  seoDescription: z.string().nullable().optional(),
  productCategoryId: z.uuid().optional().nullable(),
  brandId: z.uuid().optional().nullable(),
  detail: z.string().nullable().optional(),
  mainImage: z.string(),
  listImages: z.array(z.string()),
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
  type: z.enum(EProductType),
  attributes: z.array(ProductAttributeDTO),
  skus: z.array(ProductSkuDTO),
});

export const DeleteBodyDTO = z.object({
  ids: z.array(z.uuid()),
});
