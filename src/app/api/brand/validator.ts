import { OrderQueryDTO, SearchQueryDTO } from "@/lib/zod/paginationDTO";
import { Brand } from "@prisma/client";
import { z } from "zod/v4";

export const GetQueryDTO = z.object({
  orderQuery: OrderQueryDTO.shape.orderQuery.optional(),
  searchQuery: SearchQueryDTO(["name"] as (keyof Brand)[]).shape.searchQuery.optional(),
});

export const PostCreateBodyDTO = z.object({
  name: z.string(),
  logoUrl: z.string(),
  isActive: z.boolean().optional().default(true),
});

export const DeleteBodyDTO = z.object({
  ids: z.array(z.uuidv4()),
});
