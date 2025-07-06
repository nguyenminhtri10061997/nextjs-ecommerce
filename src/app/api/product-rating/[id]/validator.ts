import { z } from "zod/v4";

export const IdParamsDTO = z.object({
  id: z.uuid(),
});

export const PatchBodyDTO = z.object({
  rating: z.number().min(0).max(5).optional(),
  title: z.string().optional(),
  detail: z.string().optional(),
  video: z.string().nullable().optional(),
  images: z.array(z.string()).optional(),
  isVerify: z.boolean().optional(),
});
