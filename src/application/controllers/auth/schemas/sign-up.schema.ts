import { z } from "zod";

export const signUpSchema = z.object({
  account: z.object({
    email: z.email({ error: "Email is invalid" }).min(1, { error: "Email is required" }),
    password: z
      .string()
      .min(8, { error: "Password should be at least 8 characters long" })
      .regex(/[a-z]/, { error: "Password must contain at least one lowercase letter" })
      .regex(/[A-Z]/, { error: "Password must contain at least one uppercase letter" })
      .regex(/[0-9]/, { error: "Password must contain at least one number" })
      .regex(/[\W]/, { error: "Password must contain at least one special character" })
    ,
  }),
});

export type SignUpBody = z.infer<typeof signUpSchema>;
