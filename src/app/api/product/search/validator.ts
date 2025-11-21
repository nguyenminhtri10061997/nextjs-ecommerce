import {
  OrderQueryDTO,
  PagingQueryDTO,
  SearchQueryDTO,
} from "@/lib/zod/paginationDTO"
import { Product } from "@prisma/client"
import { z } from "zod/v4"

export const GetQueryDTO = z.object({
  pagination: PagingQueryDTO.shape.pagination.optional(),
  orderQuery: OrderQueryDTO([
    "createdAt",
    "updatedAt",
  ] as (keyof Product)[]).shape.orderQuery.optional(),
  searchQuery: SearchQueryDTO([
    "name",
  ]).shape.searchQuery.optional(),
})
