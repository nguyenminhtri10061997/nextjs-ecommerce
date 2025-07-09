import { z } from "zod/v4";

export const IdParamsDTO = z.object({
  id: z.uuid(),
});

export const PatchBodyDTO = z.object({
  code: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  isActive: z.boolean().optional(),
  isDefault: z.boolean().nullable().optional(),
});
