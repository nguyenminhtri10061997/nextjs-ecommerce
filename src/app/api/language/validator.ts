import { OrderQueryDTO, SearchQueryDTO } from "@/lib/zod/paginationDTO";
import { Language } from "@prisma/client";
import { z } from "zod/v4";

export const GetQueryDTO = z.object({
  orderQuery: OrderQueryDTO.shape.orderQuery.optional(),
  searchQuery: SearchQueryDTO(["name", "code"] as (keyof Language)[]).shape.searchQuery.optional(),
});

export const PostCreateBodyDTO = z.object({
  code: z.string(),
  name: z.string(),
  isActive: z.boolean().optional(),
  isDefault: z.boolean().optional(),
});

export const DeleteBodyDTO = z.object({
  ids: z.array(z.uuid()),
});
