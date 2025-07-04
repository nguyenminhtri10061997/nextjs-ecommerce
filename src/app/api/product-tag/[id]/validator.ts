import { ETagDisplayType } from "@prisma/client";
import { z } from "zod/v4";

export const IdParamsDTO = z.object({
  id: z.uuid(),
});

export const PutBodyDTO = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  expiredAfterDays: z.number().nonnegative().nullable(),
  displayType: z.enum(ETagDisplayType),
  image: z.string().optional(),
  bgColor: z.string().optional(),
  textColor: z.string().optional(),
  displayOrder: z.number().nonnegative().optional(),
  isActive: z.boolean().optional(),
});
