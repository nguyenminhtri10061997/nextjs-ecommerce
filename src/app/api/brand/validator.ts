import { OrderQueryDTO, SearchQueryDTO } from "@/lib/zod/paginationDTO";
import { Brand } from "@prisma/client";
import { z } from "zod/v4";

export const GetQueryDTO = z.object({
  orderQuery: OrderQueryDTO.shape.orderQuery.optional(),
  searchQuery: SearchQueryDTO([
    "name",
    "slug",
  ] as (keyof Brand)[]).shape.searchQuery.optional(),
});

export const PostCreateBodyDTO = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  logoImgFile: z.file().nullable().optional(),
  isActive: z.boolean().optional(),
});

export const DeleteBodyDTO = z.object({
  ids: z.array(z.uuidv4()),
});
