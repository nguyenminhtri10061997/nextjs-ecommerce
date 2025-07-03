import { OrderQueryDTO, SearchQueryDTO } from "@/lib/zod/paginationDTO";
import { ProductStatus } from "@prisma/client";
import { z } from "zod/v4";

export const GetQueryDTO = z.object({
  orderQuery: OrderQueryDTO.shape.orderQuery.optional(),
  searchQuery: SearchQueryDTO(["name", "slug"] as (keyof ProductStatus)[]).shape.searchQuery.optional(),
});

export const PostCreateBodyDTO = z.object({
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  expiredAfterDays: z.number().nonnegative(),
  image: z.string(),
  backgroundColor: z.string(),
  displayOrder: z.number().nonnegative(),
  isActive: z.boolean().optional().default(true),
});

export const DeleteBodyDTO = z.object({
  ids: z.array(z.uuid()),
});
