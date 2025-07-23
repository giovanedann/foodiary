import { z } from "zod";

export const helloSchema = z.object({
  name: z.string().min(1, { error: "Name is required" }),
  email: z
    .email({ error: "Email is invalid" })
    .min(1, { error: "Email is required" }),
});

export type HelloBody = z.infer<typeof helloSchema>;
