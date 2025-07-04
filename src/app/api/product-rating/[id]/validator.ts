import { z } from "zod/v4";

export const IdParamsDTO = z.object({
  id: z.uuid(),
});

export const PutBodyDTO = z.object({
  rating: z.number().min(0).max(5),
  title: z.string(),
  detail: z.string(),
  video: z.string(),
  images: z.array(z.string()),
  isVerify: z.boolean(),
});
