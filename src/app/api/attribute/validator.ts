import { z } from "zod/v4";
import { EAttributeType } from "@prisma/client";
import { OrderQueryDTO, SearchQueryDTO } from "@/lib/zod/paginationDTO";
import { Attribute } from "@prisma/client";

export const AttributeValueDTO = z.object({
  name: z.string().min(1),
});

export const GetQueryDTO = z.object({
  orderQuery: OrderQueryDTO.shape.orderQuery.optional(),
  searchQuery: SearchQueryDTO(["name"] as (keyof Attribute)[]).shape.searchQuery.optional(),
});

export const PostCreateBodyDTO = z.object({
  name: z.string(),
  type: z.enum(EAttributeType),
  attributeValues: z.array(AttributeValueDTO).optional().default([]),
});

export const DeleteBodyDTO = z.object({
  ids: z.array(z.uuid()),
});
