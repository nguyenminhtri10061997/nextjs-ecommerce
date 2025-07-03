import { z } from "zod/v4";
import { OrderQueryDTO, SearchQueryDTO } from "@/lib/zod/paginationDTO";
import { ProductRating } from "@prisma/client";

export const GetQueryDTO = z.object({
  orderQuery: OrderQueryDTO.shape.orderQuery.optional(),
  searchQuery: SearchQueryDTO(["title", "detail"] as (keyof ProductRating)[]).shape.searchQuery.optional(),
});

export const PostCreateBodyDTO = z.object({
  userId: z.uuid(),
  productId: z.uuid(),
  rating: z.number().min(0).max(5),
  title: z.string(),
  detail: z.string(),
  video: z.string().optional().default(""),
  images: z.string().optional().default(""),
});

export const DeleteBodyDTO = z.object({
  ids: z.array(z.uuid()),
});
