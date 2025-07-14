import { z } from "zod/v4";
import { OrderQueryDTO, SearchQueryDTO } from "@/lib/zod/paginationDTO";
import { ProductCategory } from "@prisma/client";

export const GetQueryDTO = z.object({
  orderQuery: OrderQueryDTO(['createdAt', 'updatedAt'] as (keyof ProductCategory)[]).shape.orderQuery.optional(),
  searchQuery: SearchQueryDTO(["name", "slug"] as (keyof ProductCategory)[]).shape.searchQuery.optional(),
});

export const PostCreateBodyDTO = z.object({
  name: z.string(),
  slug: z.string(),
  seoTitle: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  seoDescription: z.string().nullable().optional(),
  displayOrder: z.number().nonnegative().nullable().optional(),
  productCategoryParentId: z.uuid().nullable().optional(),
  isActive: z.boolean().nullable().optional(),
});

export const DeleteBodyDTO = z.object({
  ids: z.array(z.uuid()),
});
