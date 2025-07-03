import { EUserOrAccountType } from "@prisma/client";
import { z } from "zod/v4";

export const idParamsDTO = z.object({
  id: z.uuidv4(),
});

export const putBodyDTO = z.object({
  fullName: z.string(),
  type: z.enum(EUserOrAccountType),
  account: z.object({
    username: z.string(),
    newPassword: z.string().optional(),
    roleId: z.uuidv4(),
    isBanned: z.boolean().optional(),
    isBlocked: z.boolean().optional(),
    accessTokenVersion: z.coerce.number().nonnegative().int(),
  })
})