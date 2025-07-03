import { z } from "zod/v4";

export const IdParamsDTO = z.object({
    id: z.uuidv4(),
});


export const PutBodyDTO = z.object({
    name: z.string(),
    logoUrl: z.string(),
    isActive: z.boolean(),
});
