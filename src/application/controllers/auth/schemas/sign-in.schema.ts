import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .email({ error: "field 'email' has an invalid format" })
    .min(1, {
      error: (issue) =>
        issue.input === undefined
          ? "field 'email' is required on the request body"
          : "field 'email' must be a non-empty string",
    }),
  password: z
    .string()
    .min(1, {
      error: (issue) =>
        issue.input === undefined
          ? "field 'password' is required on the request body"
          : "field 'password' must be a non-empty string",
    }),
});

export type SignInBody = z.infer<typeof signInSchema>;
