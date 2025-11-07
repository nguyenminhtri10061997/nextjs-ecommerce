import { z } from "zod/v4"

export const IdParamsDTO = z.object({
  id: z.uuid(),
})

const OptionItemDTO = z.object({
  id: z.uuid().optional(),
  name: z.string().min(1).optional(),
  slug: z.string().min(1).nullable().optional(),
  isActive: z.boolean().optional(),
  displayOrder: z.number().nonnegative().nullable().optional(),
})

export const PatchBodyDTO = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).nullable().optional(),
  isActive: z.boolean().optional(),
  displayOrder: z.number().nonnegative().nullable().optional(),
  optionItems: z.array(OptionItemDTO).optional(),
})
