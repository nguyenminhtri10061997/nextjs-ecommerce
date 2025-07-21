import { EAttributeType } from "@prisma/client";
import { z } from "zod/v4";

export const IdParamsDTO = z.object({
  id: z.uuid(),
});

const AttributeValueDTO = z.object({
  id: z.uuid().optional(),
  name: z.string().min(1),
  slug: z.string().min(1),
  displayOrder: z.number().nonnegative().nullable().optional(),
});

export const PatchBodyDTO = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  type: z.enum(EAttributeType).optional(),
  attributeValues: z.array(AttributeValueDTO).optional(),
});
