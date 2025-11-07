import { z } from "zod/v4";

export const IdParamsDTO = z.object({
  id: z.uuid(),
});

export const PatchBodyDTO = z.object({
  name: z.string().optional(),
  slug: z.string().nullable().optional(),
  seoTitle: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  seoDescription: z.string().nullable().optional(),
  displayOrder: z.number().nonnegative().nullable().optional(),
  productCategoryParentId: z.uuid().nullable().optional(),
  isActive: z.boolean().optional(),
});
