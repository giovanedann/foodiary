import OpenAI, { toFile } from "openai";
import { z } from "zod";

import { Meal } from "@application/entities/meal.entity";

import { MealsFileStorageGateway } from "@infra/gateways/meals-file-storage.gateway";

import { Injectable } from "@kernel/decorators/injectable";

import { downloadFileFromURL } from "@shared/utils/download-file-from-utl";

import { getImagePrompt } from "../prompts/get-image.prompt";
import { getTextPrompt } from "../prompts/get-text.prompt";

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
    const mealFileURL = this.mealsFileStorageGateway.getFileURL(
      meal.inputFileKey
    );

    if (meal.inputType === Meal.InputType.PICTURE) {
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
                image_url: { url: mealFileURL, detail: "high" },
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

    const audioFile = await downloadFileFromURL(mealFileURL);

    const { text } = await this.client.audio.transcriptions.create({
      model: "gpt-4o-mini-transcribe",
      file: await toFile(audioFile, "audio.m4a", { type: "audio/m4a" }),
    });

    console.log(text);

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
          content: getTextPrompt(),
        },
        {
          role: "user",
          content: `Meal date: ${meal.createdAt}\n\nMeal: ${text}`,
        },
      ],
    });

    const stringifiedMealJson = response.choices[0].message.content;

    if (!stringifiedMealJson) {
      console.error("Open AI response:", JSON.stringify(response, null, 2));
      throw new Error(`Failed processing meal ${meal.id}`);
    }

    const mealJson = JSON.parse(stringifiedMealJson);

    console.log(JSON.stringify(mealJson, null, 2));

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
}

export namespace MealsAIGateway {
  export type ProcessMealResult = {
    name: string;
    icon: string;
    foods: Meal.Food[];
  };
}
