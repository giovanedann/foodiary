import { z } from "zod";

export const updateGoalSchema = z.object({
  proteins: z.number().min(0, {
    error: (issue) =>
      issue.input === undefined
        ? "Field 'proteins' is required on the request body"
        : "Field 'proteins' must be a positive number",
  }),
  carbohydrates: z.number().min(0, {
    error: (issue) =>
      issue.input === undefined
        ? "Field 'carbohydrates' is required on the request body"
        : "Field 'carbohydrates' must be a positive number",
  }),
  fats: z.number().min(0, {
    error: (issue) =>
      issue.input === undefined
        ? "Field 'fats' is required on the request body"
        : "Field 'fats' must be a positive number",
  }),
  calories: z.number().min(0, {
    error: (issue) =>
      issue.input === undefined
        ? "Field 'calories' is required on the request body"
        : "Field 'calories' must be a positive number",
  }),
});

export type UpdateGoalBody = z.infer<typeof updateGoalSchema>;
