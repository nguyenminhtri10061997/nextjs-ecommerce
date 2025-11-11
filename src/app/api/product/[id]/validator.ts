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
    attributes: z.array(
      ProductAttributeSchema.omit({
        productId: true,
      }).extend({
        productAttValues: z.array(ProductAttributeValueSchema).refine(
          (arr) => {
            const seen = new Set()
            for (const item of arr) {
              const key = `${item.productAttributeId}-${item.attributeValueId}`
              if (seen.has(key)) return false
              seen.add(key)
            }
            return true
          },
          {
            message: "Duplicate productAttributeId + attributeValueId found",
          }
        ),
      })
    ),
    skus: z.array(
      ProductSkuSchema.partial().extend({
        productSkuAttVal: ProductSkuAttributeValueSchema.omit({
          productSkuId: true,
          id: true,
        }),
      })
    ),
    productToProductTags: z.array(
      ProductToProductTagSchema.pick({
        productTagId: true,
        expiredAt: true,
      })
    ),
    productOpts: z.array(
      ProductOptionSchema.partial().extend({
        productOptItems: z.array(ProductOptionToOptionItemSchema.partial()),
      })
    ),
  })
