import OpenAI from "openai";
import { z } from "zod";

import { Meal } from "@application/entities/meal.entity";

import { MealsFileStorageGateway } from "@infra/gateways/meals-file-storage.gateway";

import { Injectable } from "@kernel/decorators/injectable";
import { getImagePrompt } from "../prompts/get-image.prompt";

const mealSchema = z.object({
  name: z.string(),
  icon: z.string(),
  foods: z.array(
    z.object({
      name: z.string(),
      quantity: z.string(),
      carbohydrates: z.number(),
      fats: z.number(),
      proteins: z.number(),
      calories: z.number(),
    })
  ),
});

@Injectable()
export class MealsAIGateway {
  private readonly client = new OpenAI();

  constructor(
    private readonly mealsFileStorageGateway: MealsFileStorageGateway
  ) {}

  async processMeal(meal: Meal): Promise<MealsAIGateway.ProcessMealResult> {
    if (meal.inputType === Meal.InputType.PICTURE) {
      const imageUrl = this.mealsFileStorageGateway.getFileURL(
        meal.inputFileKey
      );

      const response = await this.client.chat.completions.create({
        model: "gpt-5-nano",
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "meal",
            strict: true,
            schema: z.toJSONSchema(mealSchema),
          },
        },
        messages: [
          {
            role: "system",
            content: getImagePrompt(),
          },
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: { url: imageUrl, detail: "high" },
              },
              {
                type: "text",
                text: `Meal date: ${meal.createdAt}`,
              },
            ],
          },
        ],
      });

      const stringifiedMealJson = response.choices[0].message.content;

      if (!stringifiedMealJson) {
        console.error("Open AI response:", JSON.stringify(response, null, 2));
        throw new Error(`Failed processing meal ${meal.id}`);
      }

      const mealJson = JSON.parse(stringifiedMealJson);

      const { success, error, data } = mealSchema.safeParse(mealJson);

      if (!success) {
        console.error(
          "Failed parsing meal json in MealsAIGateway.processMeal.",
          error
        );
        throw new Error(
          `Failed processing meal ${meal.id}. Invalid JSON meal output.`
        );
      }

      return data;
    }

    return {
      name: meal.name,
      icon: meal.icon,
      foods: meal.foods,
    };
  }
}

export namespace MealsAIGateway {
  export type ProcessMealResult = {
    name: string;
    icon: string;
    foods: Meal.Food[];
  };
}
