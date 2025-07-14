import { DateRangeQueryDTO, OrderQueryDTO, PagingQueryDTO, SearchQueryDTO } from "@/lib/zod/paginationDTO";
import { Role } from "@prisma/client";
import { z } from "zod/v4";

export const GetQueryDTO = z.object({
  pagination: PagingQueryDTO.shape.pagination.optional(),
    orderQuery: OrderQueryDTO(['createdAt', 'updatedAt'] as (keyof Role)[]).shape.orderQuery.optional(),
  searchQuery: SearchQueryDTO(["name"] as (keyof Role)[]).shape.searchQuery.optional(),
  dateRangeQuery: DateRangeQueryDTO.shape.dateRangeQuery.optional(),
});

export const PostCreateBodyDTO = z.object({
  name: z.string(),
  description: z.string().optional(),
  permissionIds: z.array(z.uuidv4()),
});

export const DeleteBodyDTO = z.object({
  ids: z.array(z.uuidv4()),
});
