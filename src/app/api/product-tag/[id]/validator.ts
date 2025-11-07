import { ETagDisplayType } from "@prisma/client";
import { z } from "zod/v4";

export const IdParamsDTO = z.object({
  id: z.uuid(),
});

export const PatchBodyDTO = z.object({
  code: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  slug: z.string().min(1).nullable().optional(),
  description: z.string().nullable().optional(),
  expiredAfterDays: z.number().nonnegative().nullable().optional(),
  displayType: z.enum(ETagDisplayType).optional(),
  image: z.string().nullable().optional(),
  bgColor: z.string().nullable().optional(),
  textColor: z.string().nullable().optional(),
  displayOrder: z.number().nonnegative().nullable().optional(),
  isActive: z.boolean().optional(),
});
