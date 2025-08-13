import { Meal } from "@application/entities/meal.entity";
import { ResourceNotFoundError } from "@application/errors/application/resource-not-found.error";
import { MealRepository } from "@infra/database/dynamo/repositories/meal.repository";
import { MealsFileStorageGateway } from "@infra/gateways/meals-file-storage.gateway";
import { Injectable } from "@kernel/decorators/injectable";

@Injectable()
export class GetMealByIdUseCase {
  constructor(
    private readonly mealRepository: MealRepository,
    private readonly mealsFileStorageGateway: MealsFileStorageGateway
  ) {}

  async execute({
    accountId,
    mealId,
  }: GetMealByIdUseCase.Input): Promise<GetMealByIdUseCase.Output> {
    const meal = await this.mealRepository.findById({ accountId, mealId });

    if (!meal) {
      throw new ResourceNotFoundError("Meal not found");
    }

    const inputFileURL = this.mealsFileStorageGateway.getFileURL(
      meal.inputFileKey
    );

    return {
      meal: {
        id: meal.id,
        status: meal.status,
        inputType: meal.inputType,
        inputFileURL,
        name: meal.name,
        icon: meal.icon,
        foods: meal.foods,
        createdAt: meal.createdAt.toISOString(),
      },
    };
  }
}

export namespace GetMealByIdUseCase {
  export type Input = {
    accountId: string;
    mealId: string;
  };

  export type Output = {
    meal: {
      id: string;
      status: Meal.Status;
      inputType: Meal.InputType;
      inputFileURL: string;
      name: string;
      icon: string;
      foods: Meal.Food[];
      createdAt: string;
    };
  };
}
