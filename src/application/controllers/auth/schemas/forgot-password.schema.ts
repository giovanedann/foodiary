import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, {
    error: (issue) =>
      issue.input === undefined
        ? "Field 'email' is required on the request body"
        : "Field 'email' must be a non-empty string",
  }),
});

export type ForgotPasswordBody = z.infer<typeof forgotPasswordSchema>;
