import { z } from "zod/v4";

export const idParamsDTO = z.object({
  id: z.uuidv4(),
});

export const PatchBodyDTO = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  permissionIds: z.array(z.uuidv4()).optional(),
});
