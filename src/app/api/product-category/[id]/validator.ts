import { z } from "zod/v4";

export const IdParamsDTO = z.object({
  id: z.uuid(),
});

export const PutBodyDTO = z.object({
  name: z.string(),
  seoTitle: z.string(),
  description: z.string(),
  seoDescription: z.string(),
  displayOrder: z.number().nonnegative(),
  productCategoryParentId: z.uuid().nullable().optional(),
  isActive: z.boolean(),
});
