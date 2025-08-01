import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .email({ error: "field 'email' has an invalid format" })
    .min(1, { error: "field 'email' is required on the request body" }),
  password: z
    .string()
    .min(1, { error: "field 'password' is required on the request body" }),
});

export type SignInBody = z.infer<typeof signInSchema>;
