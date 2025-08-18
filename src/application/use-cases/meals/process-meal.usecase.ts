import { Meal } from "@application/entities/meal.entity";
import { ResourceNotFoundError } from "@application/errors/application/resource-not-found.error";

import { MealsAIGateway } from "@infra/ai/gateways/meals-ai.gateway";
import { MealRepository } from "@infra/database/dynamo/repositories/meal.repository";

import { Injectable } from "@kernel/decorators/injectable";

const MAX_ATTEMPTS_ALLOWED = 2;

@Injectable()
export class ProcessMealUseCase {
  constructor(
    private readonly mealRepository: MealRepository,
    private readonly mealsAIGateway: MealsAIGateway
  ) {}

  async execute({
    accountId,
    mealId,
  }: ProcessMealUseCase.Input): Promise<ProcessMealUseCase.Output> {
    const meal = await this.mealRepository.findById({ accountId, mealId });

    if (!meal) {
      throw new ResourceNotFoundError(`Meal "${mealId}" not found.`);
    }

    if (meal.status === Meal.Status.UPLOADING) {
      throw new Error(`Meal "${mealId}" is still uploading.`);
    }

    if (meal.status === Meal.Status.PROCESSING) {
      throw new Error(`Meal "${mealId}" is already being processed.`);
    }

    if (
      meal.status === Meal.Status.FAILED ||
      meal.status === Meal.Status.SUCCESS
    ) {
      // Return to remove message from queue
      return;
    }

    try {
      meal.status = Meal.Status.PROCESSING;
      meal.attempts += 1;

      await this.mealRepository.save(meal);

      const { name, icon, foods } = await this.mealsAIGateway.processMeal(meal);

      meal.status = Meal.Status.SUCCESS;
      meal.name = name;
      meal.icon = icon;
      meal.foods = foods;

      await this.mealRepository.save(meal);
    } catch (error) {
      meal.status =
        meal.attempts >= MAX_ATTEMPTS_ALLOWED
          ? Meal.Status.FAILED
          : Meal.Status.QUEUED;

      await this.mealRepository.save(meal);

      // Rethrow to keep the message in queue or send it to DLQ
      throw error;
    }
  }
}

export namespace ProcessMealUseCase {
  export type Input = {
    accountId: string;
    mealId: string;
  };

  export type Output = void;
}
