import { z } from "zod/v4";

export const IdParamsDTO = z.object({
  id: z.uuid(),
});

export const PutBodyDTO = z.object({
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  expiredAfterDays: z.number().nonnegative(),
  image: z.string(),
  backgroundColor: z.string(),
  displayOrder: z.number().nonnegative(),
  isActive: z.boolean(),
});
