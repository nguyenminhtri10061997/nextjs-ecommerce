import { OrderQueryDTO, SearchQueryDTO } from "@/lib/zod/paginationDTO";
import { ProductTag, ETagDisplayType } from "@prisma/client";
import { z } from "zod/v4";

export const GetQueryDTO = z.object({
  orderQuery: OrderQueryDTO.shape.orderQuery.optional(),
  searchQuery: SearchQueryDTO(["name", "slug"] as (keyof ProductTag)[]).shape.searchQuery.optional(),
});

export const PostCreateBodyDTO = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  expiredAfterDays: z.number().nonnegative().optional().nullable(),
  displayType: z.enum(ETagDisplayType),
  image: z.string().optional(),
  bgColor: z.string().optional(),
  textColor: z.string().optional(),
  displayOrder: z.number().nonnegative().optional(),
  isActive: z.boolean().optional(),
});

export const DeleteBodyDTO = z.object({
  ids: z.array(z.uuid()),
});
