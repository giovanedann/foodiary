import { Meal } from "@application/entities/meal.entity";
import { MealRepository } from "@infra/database/dynamo/repositories/meal.repository";
import { MealsFileStorageGateway } from "@infra/gateways/meals-file-storage.gateway";
import { Injectable } from "@kernel/decorators/injectable";

@Injectable()
export class CreateMealUseCase {
  constructor(
    private readonly mealRepository: MealRepository,
    private readonly mealsFileStorageGateway: MealsFileStorageGateway,
  ) {}

  async execute({
    accountId,
    file,
  }: CreateMealUseCase.Input): Promise<CreateMealUseCase.Output> {
    const inputFileKey = MealsFileStorageGateway.generateInputFileKey({
      accountId,
      inputType: file.inputType,
    });

    const mealEntity = new Meal({
      accountId,
      inputFileKey,
      inputType: file.inputType,
      status: Meal.Status.UPLOADING,
    });

    const [{ uploadSignature }] = await Promise.all([
      this.mealsFileStorageGateway.createPOST({
        accountId,
        mealId: mealEntity.id,
        file: {
          key: inputFileKey,
          inputType: file.inputType,
          size: file.size,
        },
      }),
      this.mealRepository.create(mealEntity),
    ]);

    return {
      mealId: mealEntity.id,
      uploadSignature,
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
    uploadSignature: string;
  };
}
