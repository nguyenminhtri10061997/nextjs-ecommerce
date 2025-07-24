import { z } from "zod/v4";

export const GetQueryDTO = z.object({
  fileName: z
    .string()
    .min(1, "File name is required")
    .regex(/^[a-zA-Z0-9._-]+$/, "Invalid file name format"),
  contentType: z
    .string()
    .refine(
      (val) => val.startsWith("image/") || val.startsWith("video/"),
      "Only image and video content types are allowed"
    ),
});
