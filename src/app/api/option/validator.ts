import { OrderQueryDTO, SearchQueryDTO } from "@/common/zod/paginationDTO";
import { Option } from "@prisma/client";
import { z } from "zod/v4";

export const GetQueryDTO = z.object({
  orderQuery: OrderQueryDTO([
    "createdAt",
    "updatedAt",
    "displayOrder",
  ] as (keyof Option)[]).shape.orderQuery.optional(),
  searchQuery: SearchQueryDTO([
    "name",
    "slug",
  ] as (keyof Option)[]).shape.searchQuery.optional(),
});

const OptionItemDTO = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  isActive: z.boolean().optional(),
  displayOrder: z.number().nonnegative().nullable().optional(),
});

export const PostCreateBodyDTO = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  displayOrder: z.number().nonnegative().nullable().optional(),
  optionItems: z.array(OptionItemDTO).optional(),
});

export const DeleteBodyDTO = z.object({
  ids: z.array(z.uuid()),
});
