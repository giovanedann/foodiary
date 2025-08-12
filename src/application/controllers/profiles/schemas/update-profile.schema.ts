import { z } from "zod";
import { Profile } from "@application/entities/profile.entity";

export const updateProfileSchema = z.object({
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
});

export type UpdateProfileBody = z.infer<typeof updateProfileSchema>;
