import { OrderQueryDTO, SearchQueryDTO } from "@/common/zod/paginationDTO";
import { ProductTag, ETagDisplayType } from "@prisma/client";
import { z } from "zod/v4";

export const GetQueryDTO = z.object({
  orderQuery: OrderQueryDTO(['createdAt', 'updatedAt'] as (keyof ProductTag)[]).shape.orderQuery.optional(),
  searchQuery: SearchQueryDTO(["name", "slug"] as (keyof ProductTag)[]).shape.searchQuery.optional(),
});

export const PostCreateBodyDTO = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().nullable().optional(),
  expiredAfterDays: z.number().nonnegative().optional().nullable(),
  displayType: z.enum(ETagDisplayType),
  image: z.string().nullable().optional(),
  bgColor: z.string().nullable().optional(),
  textColor: z.string().nullable().optional(),
  displayOrder: z.number().nonnegative().nullable().optional(),
  isActive: z.boolean().optional(),
});

export const DeleteBodyDTO = z.object({
  ids: z.array(z.uuid()),
});
