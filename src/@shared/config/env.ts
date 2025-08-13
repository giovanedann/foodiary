import { z } from "zod";

export const envSchema = z.object({
  // Cognito
  COGNITO_CLIENT_ID: z
    .string()
    .min(1, { error: "Cognito client id missing in environment variables" }),
  COGNITO_CLIENT_SECRET: z.string().min(1, {
    error: "Cognito client secret missing in environment variables",
  }),
  COGNITO_USER_POOL_ID: z.string().min(1, {
    error: "Cognito user pool id missing in environment variables",
  }),

  // DynamoDB
  DYNAMO_DB_MAIN_TABLE_NAME: z.string().min(1, {
    error: "DynamoDB main table name missing in environment variables",
  }),

  // S3 bucket
  MEALS_BUCKET: z.string().min(1, {
    error: "Meals bucket missing in environment variables",
  }),

  // CDN
  MEALS_CDN_DOMAIN_NAME: z.string().min(1, {
    error: "Meals CDN domain name missing in environment variables",
  }),
});

export const env = envSchema.parse(process.env);
