import { z } from "zod/v4";
import { OrderQueryDTO, SearchQueryDTO } from "@/lib/zod/paginationDTO";
import { ProductCategory } from "@prisma/client";

export const GetQueryDTO = z.object({
  orderQuery: OrderQueryDTO.shape.orderQuery.optional(),
  searchQuery: SearchQueryDTO(["name", "seoTitle"] as (keyof ProductCategory)[]).shape.searchQuery.optional(),
});

export const PostCreateBodyDTO = z.object({
  name: z.string(),
  slug: z.string(),
  seoTitle: z.string().optional(),
  description: z.string().optional(),
  seoDescription: z.string().optional(),
  displayOrder: z.number().nonnegative().optional(),
  productCategoryParentId: z.uuid().nullable().optional(),
  isActive: z.boolean().optional(),
});

export const DeleteBodyDTO = z.object({
  ids: z.array(z.uuid()),
});
