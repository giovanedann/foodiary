import { Injectable } from "@kernel/decorators/injectable";

import { Controller } from "@application/contracts/controller";
import { Meal } from "@application/entities/meal.entity";
import { GetMealByIdUseCase } from "@application/use-cases/meals/get-meal-by-id.usecase";

@Injectable()
export class GetMealByIdController extends Controller<
  "private",
  GetMealByIdController.Response
> {
  constructor(private readonly getMealByIdUseCase: GetMealByIdUseCase) {
    super();
  }

  protected override async handle({
    accountId,
    params,
  }: GetMealByIdController.Request): Promise<
    Controller.Response<GetMealByIdController.Response>
  > {
    const { mealId } = params;

    const { meal } = await this.getMealByIdUseCase.execute({
      accountId,
      mealId,
    });

    return {
      statusCode: 200,
      body: {
        meal,
      },
    };
  }
}

export namespace GetMealByIdController {
  export type Params = {
    mealId: string;
  };

  export type Request = Controller.Request<
    "private",
    Record<string, unknown>,
    GetMealByIdController.Params
  >;

  export type Response = {
    meal: {
      id: string;
      status: Meal.Status;
      inputType: Meal.InputType;
      inputFileKey: string;
      name: string;
      icon: string;
      foods: Meal.Food[];
      createdAt: string;
    };
  };
}
