import { DateRangeQueryDTO, OrderQueryDTO, PagingQueryDTO } from "@/lib/zod/paginationDTO";
import { z } from "zod/v4";

export const GetQueryDTO = z.object({
  pagination: PagingQueryDTO.shape.pagination,
  orderQuery: OrderQueryDTO.shape.orderQuery.optional(),
  dateRangeQuery: DateRangeQueryDTO.shape.dateRangeQuery.optional(),
  ratings: z.array(z.number().min(0).max(5)).optional()
});

export const PostCreateBodyDTO = z.object({
  userId: z.uuid(),
  productId: z.uuid(),
  rating: z.number().min(0).max(5),
  title: z.string(),
  detail: z.string(),
  video: z.string().optional(),
  images: z.array(z.string()).optional(),
});

export const DeleteBodyDTO = z.object({
  ids: z.array(z.uuid()),
});
