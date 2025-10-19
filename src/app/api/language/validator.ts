import { OrderQueryDTO, SearchQueryDTO } from "@/common/zod/paginationDTO";
import { Language } from "@prisma/client";
import { z } from "zod/v4";

export const GetQueryDTO = z.object({
  orderQuery: OrderQueryDTO(['createdAt', 'updatedAt'] as (keyof Language)[]).shape.orderQuery.optional(),
  searchQuery: SearchQueryDTO(["name", "code"] as (keyof Language)[]).shape.searchQuery.optional(),
});

export const PostCreateBodyDTO = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  isActive: z.boolean().optional(),
  isDefault: z.boolean().nullable().optional(),
});

export const DeleteBodyDTO = z.object({
  ids: z.array(z.uuid()),
});
