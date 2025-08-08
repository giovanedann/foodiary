import { z } from "zod";

import { mbToBytes } from "@shared/utils/mb-to-bytes";

export const createMealSchema = z.object({
  file: z.object({
    type: z.enum(["audio/m4a", "image/jpeg"]),
    size: z
      .number()
      .min(1, {
        error: "File must have at least 1 byte.",
      })
      .max(mbToBytes(10), {
        error: "File size must be less than 10MB.",
      }),
  }),
});

export type CreateMealBody = z.infer<typeof createMealSchema>;
