import { z } from "zod/v4";

export const idParamsDTO = z.object({
  id: z.uuidv4(),
});

export const putBodyDTO = z.object({
  name: z.string(),
  description: z.string(),
  permissionIds: z.array(z.uuidv4()),
});