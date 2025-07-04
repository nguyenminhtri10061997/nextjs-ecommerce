import { z } from "zod/v4";

export const IdParamsDTO = z.object({
  id: z.uuid(),
});

export const PutBodyDTO = z.object({
  name: z.string(),
  slug: z.string(),
  seoTitle: z.string().optional(),
  description: z.string().optional(),
  seoDescription: z.string().optional(),
  displayOrder: z.number().nonnegative().optional(),
  productCategoryParentId: z.uuid().nullable(),
  isActive: z.boolean(),
});
