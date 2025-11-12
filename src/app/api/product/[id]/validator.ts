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
import z from "zod"

export const IdParamsDTO = z.object({
  id: z.uuid(),
})

export const PatchUpdateProductDTO = ProductSchema.omit({
  id: true,
})
  .partial()
  .extend({
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
      ),
    skus: z.array(
      ProductSkuSchema.partial().extend({
        productSkuAttVals: z.array(
          ProductSkuAttributeValueSchema.omit({
            productSkuId: true,
            id: true,
          })
        ),
      })
    ),
    productToProductTags: z.array(
      ProductToProductTagSchema.pick({
        productTagId: true,
        expiredAt: true,
      })
    ),
    productOpts: z.array(
      ProductOptionSchema.omit({
        id: true,
        productId: true,
      })
        .partial()
        .required({
          optionId: true,
        })
        .extend({
          productOptItems: z.array(
            ProductOptionToOptionItemSchema.omit({
              id: true,
              productOptionId: true,
            })
              .partial()
              .required({
                optionItemId: true,
              })
          ),
        })
    ),
  })
