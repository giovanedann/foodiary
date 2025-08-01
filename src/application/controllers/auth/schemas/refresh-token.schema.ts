import { z } from "zod";

export const refreshTokenSchema = z.object({
  refreshToken: z
    .string()
    .min(1, {
      error: (issue) =>
        issue.input === undefined
          ? "Field 'refreshToken' is required on the request body"
          : "Field 'refreshToken' must be a non-empty string",
    }),
});

export type RefreshTokenBody = z.infer<typeof refreshTokenSchema>;
