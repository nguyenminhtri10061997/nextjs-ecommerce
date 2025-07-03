import { z } from "zod/v4";

export const IdParamsDTO = z.object({
  id: z.uuid(),
});

export const PutBodyDTO = z.object({
  code: z.string(),
  name: z.string(),
  iconUrl: z.string(),
  displayOrder: z.number(),
  isActive: z.boolean(),
  isDefault: z.boolean(),
});
