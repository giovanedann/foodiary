import { z } from "zod";

export const listMealsByDaySchema = z.object({
  date: z.iso
    .date({
      error: (issue) =>
        issue.input === undefined
          ? "Field 'date' is required on the request body"
          : "Field 'date' must be a valid date (YYYY-MM-DD)",
    })
    .transform((date) => new Date(date)),
});

export type ListMealsByDayBody = z.infer<typeof listMealsByDaySchema>;
