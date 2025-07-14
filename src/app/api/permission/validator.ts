import { OrderQueryDTO, PagingQueryDTO } from "@/lib/zod/paginationDTO";
import { EPermissionAction, EPermissionResource, Permission } from "@prisma/client";
import { z } from "zod/v4";

export const GetQueryDTO = z.object({
    pagination: PagingQueryDTO.shape.pagination.optional(),
    action: z.enum(EPermissionAction).optional(),
    resource: z.enum(EPermissionResource).optional(),
      orderQuery: OrderQueryDTO(['createdAt', 'updatedAt'] as (keyof Permission)[]).shape.orderQuery.optional(),
});
