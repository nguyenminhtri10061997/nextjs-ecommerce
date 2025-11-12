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
} from "@prisma/generated/schemas/models"
import { z } from "zod/v4"

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
    .array(
      ProductOptionSchema.omit({
        id: true,
        productId: true,
      }).extend({
        productOptItems: z.array(
          ProductOptionToOptionItemSchema.omit({
            id: true,
            productOptionId: true,
          })
        ),
      })
    )
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
  attributes: z
    .array(
      ProductAttributeSchema.omit({
        productId: true,
      }).extend({
        productAttValues: z
          .array(
            ProductAttributeValueSchema.omit({
              productAttributeId: true,
            })
          )
          .refine(
            (arr) => {
              const seen = new Set()
              for (const item of arr) {
                const key = item.attributeValueId
                if (seen.has(key)) return false
                seen.add(key)
              }
              return true
            },
            {
              message: "Duplicate attributeValueId found",
            }
          ),
      })
    )
    .refine(
      (arr) => {
        const seen = new Set()
        for (const item of arr) {
          const key = item.attributeId
          if (seen.has(key)) return false
          seen.add(key)
        }
        return true
      },
      {
        message: "Duplicate attributeId found",
      }
    )
    .optional(),
  skus: z.array(
    ProductSkuSchema.omit({
      id: true,
      productId: true,
    })
      .extend({
        productSkuAttVals: z.array(
          ProductSkuAttributeValueSchema.omit({
            productSkuId: true,
            id: true,
          })
        ),
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
            if (!ctx.value.productSkuAttVals.length) {
              ctx.issues.push({
                code: "custom",
                input: ctx.value.productSkuAttVals,
                path: ["productSkuAttVals"],
                message:
                  "productSkuAttVals is required if stockType is ATTRIBUTE",
              })
            }
            break
          default:
            break
        }
      })
  ),

  productToProductTags: z
    .array(
      ProductToProductTagSchema.omit({
        id: true,
        productId: true,
      })
    )
    .optional(),
})

export const DeleteBodyDTO = z.object({
  ids: z.array(z.uuid()),
})
