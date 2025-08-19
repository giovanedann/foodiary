import OpenAI, { toFile } from "openai";
import { ChatCompletionContentPart } from "openai/resources/index";
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
      return this.callAI({
        mealId: meal.id,
        systemPrompt: getImagePrompt(),
        userMessageParts: [
          {
            type: "image_url",
            image_url: { url: mealFileURL, detail: "high" },
          },
          {
            type: "text",
            text: `Meal date: ${meal.createdAt}`,
          },
        ],
      });
    }

    const transcribedAudio = await this.transcribe(mealFileURL);

    return this.callAI({
      mealId: meal.id,
      systemPrompt: getTextPrompt(),
      userMessageParts: `Meal date: ${meal.createdAt}\n\nMeal: ${transcribedAudio}`,
    });
  }

  private async callAI({
    userMessageParts,
    mealId,
    systemPrompt,
  }: MealsAIGateway.CallAIParams): Promise<MealsAIGateway.ProcessMealResult> {
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
          content: systemPrompt,
        },
        {
          role: "user",
          content: userMessageParts,
        },
      ],
    });

    const stringifiedMealJson = response.choices[0].message.content;

    if (!stringifiedMealJson) {
      console.error("Open AI response:", JSON.stringify(response, null, 2));
      throw new Error(`Failed processing meal ${mealId}`);
    }

    const mealJson = JSON.parse(stringifiedMealJson);

    const { success, error, data } = mealSchema.safeParse(mealJson);

    if (!success) {
      console.error(
        "Failed parsing meal json in MealsAIGateway.processMeal.",
        error
      );
      throw new Error(
        `Failed processing meal ${mealId}. Invalid JSON meal output.`
      );
    }

    return data;
  }

  private async transcribe(audioFileURL: string) {
    const audioFile = await downloadFileFromURL(audioFileURL);

    const { text } = await this.client.audio.transcriptions.create({
      model: "gpt-4o-mini-transcribe",
      file: await toFile(audioFile, "audio.m4a", { type: "audio/m4a" }),
    });

    return text;
  }
}

export namespace MealsAIGateway {
  export type ProcessMealResult = {
    name: string;
    icon: string;
    foods: Meal.Food[];
  };

  export type CallAIParams = {
    mealId: string;
    userMessageParts: string | ChatCompletionContentPart[];
    systemPrompt: string;
  };
}
