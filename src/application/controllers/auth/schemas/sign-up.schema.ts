import { Profile } from "@application/entities/profile.entity";
import { z } from "zod";

const accountSchema = z.object({
  email: z.email({ error: "Field 'email' has an invalid format" }).min(1, {
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
});

const profileSchema = z.object({
  name: z.string().min(1, {
    error: (issue) =>
      issue.input === undefined
        ? "Field 'name' is required on the request body"
        : "Field 'name' must be a non-empty string",
  }),
  birthDate: z.iso
    .date({
      error: (issue) =>
        issue.input === undefined
          ? "Field 'birthDate' is required on the request body"
          : "Field 'birthDate' must be a valid date (YYYY-MM-DD)",
    })
    .transform((date) => new Date(date)),
  gender: z.enum(Profile.Gender),
  height: z.number().min(0, {
    error: (issue) =>
      issue.input === undefined
        ? "Field 'height' is required on the request body"
        : "Field 'height' must be a positive number",
  }),
  weight: z.number().min(0, {
    error: (issue) =>
      issue.input === undefined
        ? "Field 'weight' is required on the request body"
        : "Field 'weight' must be a positive number",
  }),
  activityLevel: z.enum(Profile.ActivityLevel),
});

export const signUpSchema = z.object({
  account: accountSchema,
  profile: profileSchema,
});

export type SignUpBody = z.infer<typeof signUpSchema>;
