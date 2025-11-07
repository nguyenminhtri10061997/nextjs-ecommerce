import {
  DateRangeQueryDTO,
  OrderQueryDTO,
  PagingQueryDTO,
  SearchQueryDTO,
} from "@/lib/zod/paginationDTO"
import { Product } from "@prisma/client"
import {
  ProductAttributeSchema,
  ProductAttributeValueSchema,
  ProductOptionSchema,
  ProductOptionToOptionItemSchema,
  ProductSchema,
  ProductSkuAttributeValueSchema,
  ProductSkuSchema,
  ProductToProductTagSchema,
} from "@prisma/generated/zod"
import { z } from "zod/v4"

const ProductAttributeValueDTO = ProductAttributeValueSchema

const ProductAttributeDTO = ProductAttributeSchema.omit({
  productId: true,
}).partial({
  id: true,
}).extend({
  productAttValues: z.array(ProductAttributeValueDTO),
})

const ProductSkuAttributeValue = ProductSkuAttributeValueSchema.omit({
  id: true,
})

const ProductSkuDTO = ProductSkuSchema.omit({
  id: true,
  productId: true,
})
  .extend({
    productSkuAttValues: z.array(ProductSkuAttributeValue),
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
          })
        }
        break
      case "INVENTORY":
        if (!ctx.value.stock) {
          ctx.issues.push({
            code: "custom",
            input: ctx.value.stock,
            path: ["stock"],
            message: "stock is required if stockType is EXTERNAL",
          })
        }
        break
      case "DIGITAL":
        if (!ctx.value.downloadUrl) {
          ctx.issues.push({
            code: "custom",
            input: ctx.value.downloadUrl,
            path: ["downloadUrl"],
            message: "downloadUrl is required if stockType is DIGITAL",
          })
        }
        break
      case "ATTRIBUTE":
        if (!ctx.value.productSkuAttValues.length) {
          ctx.issues.push({
            code: "custom",
            input: ctx.value.productSkuAttValues,
            path: ["productSkuAttValues"],
            message: "productSkuAttValues is required if stockType is ATTRIBUTE",
          })
        }
        break
      default:
        break
    }
  })

const ProductOptionItemDTO = ProductOptionToOptionItemSchema.omit({
  id: true,
  productId: true,
})

const ProductToOptionDTO = ProductOptionSchema.omit({
  id: true,
  productId: true,
}).extend({
  productOptionItems: z.array(ProductOptionItemDTO),
})

const ProductTagDTO = ProductToProductTagSchema.omit({
  id: true,
  productId: true,
})

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
})

export const PostCreateBodyDTO = ProductSchema.omit({
  id: true,
}).extend({
  productOptions: z
    .array(ProductToOptionDTO)
    .check((ctx) => {
      const ids = ctx.value.map((i) => i.optionId)
      if (new Set(ids).size !== ids.length) {
        ctx.issues.push({
          code: "custom",
          input: ctx.value,
          path: ["productOptions"],
          message: "Array must contain unique optionId",
        })
      }
    })
    .optional(),
  attributes: z.array(ProductAttributeDTO).optional(),
  skus: z.array(ProductSkuDTO),
  productTags: z
    .array(ProductTagDTO)
    .check((ctx) => {
      const ids = ctx.value.map((i) => i.productTagId)
      if (new Set(ids).size !== ids.length) {
        ctx.issues.push({
          code: "custom",
          input: ctx.value,
          path: ["productTags"],
          message: "Array must contain unique productTagId",
        })
      }
    })
    .optional(),
})

export const DeleteBodyDTO = z.object({
  ids: z.array(z.uuid()),
})
