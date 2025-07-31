import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .email({ error: "Email is invalid" })
    .min(1, { error: "Email is required" }),
  password: z.string().min(1, { error: "Password  is required" }),
});

export type SignInBody = z.infer<typeof signInSchema>;
