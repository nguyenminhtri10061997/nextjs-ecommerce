import { z } from "zod/v4";

export const PostAccountLoginBodyDTO = z.object({
  username: z.string(),
  password: z.string(),
});
