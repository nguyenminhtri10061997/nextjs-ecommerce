import { z } from "zod/v4";
import { OrderQueryDTO, SearchQueryDTO } from "@/lib/zod/paginationDTO";
import { ProductCategory } from "@prisma/client";

export const GetQueryDTO = z.object({
  orderQuery: OrderQueryDTO.shape.orderQuery.optional(),
  searchQuery: SearchQueryDTO(["name", "seoTitle"] as (keyof ProductCategory)[]).shape.searchQuery.optional(),
});

export const PostCreateBodyDTO = z.object({
  name: z.string(),
  seoTitle: z.string(),
  description: z.string(),
  seoDescription: z.string(),
  displayOrder: z.number().nonnegative(),
  productCategoryParentId: z.uuid().nullable().optional(),
  isActive: z.boolean().optional().default(true),
});

export const DeleteBodyDTO = z.object({
  ids: z.array(z.uuid()),
});
