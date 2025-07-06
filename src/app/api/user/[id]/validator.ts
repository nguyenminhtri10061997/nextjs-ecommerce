import { EUserOrAccountType } from "@prisma/client";
import { z } from "zod/v4";

export const idParamsDTO = z.object({
  id: z.uuidv4(),
});

export const patchBodyDTO = z.object({
  fullName: z.string().optional(),
  type: z.enum(EUserOrAccountType).optional(),
  account: z.object({
    username: z.string().optional(),
    newPassword: z.string().optional(),
    roleId: z.uuidv4().optional(),
    isBanned: z.boolean().optional(),
    isBlocked: z.boolean().optional(),
    accessTokenVersion: z.coerce.number().nonnegative().int().optional(),
  }),
});
