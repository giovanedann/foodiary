import { Meal } from "@application/entities/meal.entity";
import { Injectable } from "@kernel/decorators/injectable";
import OpenAI from "openai";
import { MealsFileStorageGateway } from "./meals-file-storage.gateway";

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
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: { url: imageUrl, detail: "high" },
              },
              {
                type: "text",
                text: "What is this image?",
              },
            ],
          },
        ],
      });

      console.log(JSON.stringify(response, null, 2));
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
