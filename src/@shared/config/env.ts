import { z } from "zod";

export const envSchema = z.object({
  COGNITO_CLIENT_ID: z.string().min(1, { error: "Cognito client id missing in environment variables" }),
  COGNITO_CLIENT_SECRET: z.string().min(1, { error: "Cognito client secret missing in environment variables" }),
});

export const env = envSchema.parse(process.env);
