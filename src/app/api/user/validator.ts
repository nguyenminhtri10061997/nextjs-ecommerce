import { DateRangeQueryDTO, OrderQueryDTO, PagingQueryDTO, SearchQueryDTO } from "@/common/zod/paginationDTO";
import { EUserOrAccountType, User } from "@prisma/client";
import { z } from "zod/v4";

export const GetUserQueryDTO = PagingQueryDTO.extend({
    orderQuery: OrderQueryDTO(['createdAt', 'updatedAt'] as (keyof User)[]).shape.orderQuery.optional(),
  searchQuery: SearchQueryDTO(["type", "fullName"] as (keyof User)[]).shape.searchQuery.optional(),
  dateRangeQuery: DateRangeQueryDTO.shape.dateRangeQuery.optional(),
});

export const PostUserCreateBodyDTO = z.object({
  fullName: z.string(),
  type: z.enum(EUserOrAccountType),
  account: z.object({
    username: z.string(),
    password: z.string(),
    roleId: z.uuidv4(),
    isBanned: z.boolean().optional(),
    isBlocked: z.boolean().optional(),
  })
});

export const DeleteUserBodyDTO = z.object({
  ids: z.array(z.uuidv4()),
});
