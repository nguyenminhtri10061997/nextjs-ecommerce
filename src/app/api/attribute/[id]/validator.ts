import { z } from "zod/v4";
import { EAttributeType } from "@prisma/client";

export const IdParamsDTO = z.object({
  id: z.uuid(),
});

export const AttributeValueDTO = z.object({
  id: z.uuid().optional(),
  name: z.string().min(1),
});

export const PutBodyDTO = z.object({
  name: z.string(),
  type: z.enum(EAttributeType),
  attributeValues: z.array(AttributeValueDTO),
});
