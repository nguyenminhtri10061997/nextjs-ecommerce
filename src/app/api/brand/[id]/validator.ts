import { z } from "zod/v4";

export const IdParamsDTO = z.object({
    id: z.uuidv4(),
});


export const PutBodyDTO = z.object({
    name: z.string().min(1),
    slug: z.string().min(1),
    logoImage: z.string().optional(),
    isActive: z.boolean(),
});
