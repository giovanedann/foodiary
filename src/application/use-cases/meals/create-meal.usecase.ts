import { Meal } from "@application/entities/meal.entity";
import { MealRepository } from "@infra/database/dynamo/repositories/meal.repository";
import { Injectable } from "@kernel/decorators/injectable";

@Injectable()
export class CreateMealUseCase {
  constructor(private readonly mealRepository: MealRepository) {}

  async execute({
    accountId,
    file,
  }: CreateMealUseCase.Input): Promise<CreateMealUseCase.Output> {
    const mealEntity = new Meal({
      accountId,
      inputFileKey: "mocked",
      inputType: file.inputType,
      status: Meal.Status.UPLOADING,
    });

    await this.mealRepository.create(mealEntity);

    return {
      mealId: mealEntity.id,
    };
  }
}

export namespace CreateMealUseCase {
  export type Input = {
    accountId: string;
    file: {
      inputType: Meal.InputType;
      size: number;
    };
  };

  export type Output = {
    mealId: string;
  };
}
