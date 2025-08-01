import { z } from "zod";

export const signUpSchema = z.object({
  account: z.object({
    email: z
      .email({ error: "Field 'email' has an invalid format" })
      .min(1, {
        error: (issue) =>
          issue.input === undefined
            ? "Field 'email' is required on the request body"
            : "Field 'email' must be a non-empty string",
      }),
    password: z
      .string()
      .min(8, {
        error: (issue) =>
          issue.input === undefined
            ? "Field 'password' is required on the request body"
            : "Field 'password' must be at least 8 characters long",
      })
      .regex(/[a-z]/, {
        error: "Field 'password' must contain at least one lowercase letter",
      })
      .regex(/[A-Z]/, {
        error: "Field 'password' must contain at least one uppercase letter",
      })
      .regex(/[0-9]/, {
        error: "Field 'password' must contain at least one number",
      })
      .regex(/[\W]/, {
        error: "Field 'password' must contain at least one special character",
      }),
  }),
});

export type SignUpBody = z.infer<typeof signUpSchema>;
