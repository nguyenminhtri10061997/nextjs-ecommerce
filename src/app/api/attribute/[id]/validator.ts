import { z } from "zod/v4";

export const IdParamsDTO = z.object({
  id: z.uuid(),
});

const AttributeValueDTO = z.object({
  id: z.uuid().optional(),
  name: z.string().min(1),
  slug: z.string().min(1),
});

export const PatchBodyDTO = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  attributeValues: z.array(AttributeValueDTO).optional(),
});
