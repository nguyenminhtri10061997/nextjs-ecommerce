import { OrderQueryDTO, SearchQueryDTO } from "@/lib/zod/paginationDTO";
import { Attribute } from "@prisma/client";
import { z } from "zod/v4";

export const GetQueryDTO = z.object({
  orderQuery: OrderQueryDTO.shape.orderQuery.optional(),
  searchQuery: SearchQueryDTO([
    "name",
    "slug",
  ] as (keyof Attribute)[]).shape.searchQuery.optional(),
});

const AttributeValueDTO = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  displayOrder: z.number().nonnegative(),
});

export const PostCreateBodyDTO = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  attributeValues: z.array(AttributeValueDTO).optional(),
});

export const DeleteBodyDTO = z.object({
  ids: z.array(z.uuid()),
});
