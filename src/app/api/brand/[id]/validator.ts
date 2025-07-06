import { z } from "zod/v4";

export const IdParamsDTO = z.object({
  id: z.uuidv4(),
});

export const PatchBodyDTO = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  logoImage: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
});
