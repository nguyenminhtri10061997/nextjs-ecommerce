import { EUserOrAccountType } from "@prisma/client";
import { AccountSchema } from "@prisma/generated/schemas/models";
import { z } from "zod/v4";

export const idParamsDTO = z.object({
  id: z.uuidv4(),
});

export const PatchBodyDTO = z.object({
  fullName: z.string().optional(),
  type: z.enum(EUserOrAccountType).optional(),
  account: AccountSchema.omit({
    id: true,
    userId: true,
    password: true,
    type: true,
  }).extend({
    newPassword: z.string().min(0)
  }),
});
