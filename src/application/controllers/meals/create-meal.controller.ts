import { Injectable } from "@kernel/decorators/injectable";

import { Controller } from "@application/contracts/controller";
import { Meal } from "@application/entities/meal.entity";
import { CreateMealUseCase } from "@application/use-cases/meals/create-meal.usecase";
import { Schema } from "@kernel/decorators/schema";
import { CreateMealBody, createMealSchema } from "./schemas/create-meal.schema";

@Injectable()
@Schema(createMealSchema)
export class CreateMealController extends Controller<
  "private",
  CreateMealController.Response
> {
  constructor(private readonly createMealUseCase: CreateMealUseCase) {
    super();
  }

  protected override async handle({
    accountId,
    body,
  }: Controller.Request<"private", CreateMealBody>): Promise<
    Controller.Response<CreateMealController.Response>
  > {
    const { file } = body;

    const inputType =
      file.type === "audio/m4a" ? Meal.InputType.AUDIO : Meal.InputType.PICTURE;

    const { mealId } = await this.createMealUseCase.execute({
      accountId,
      file: {
        inputType,
        size: file.size,
      },
    });
    return {
      statusCode: 201,
      body: {
        mealId,
      },
    };
  }
}

export namespace CreateMealController {
  export type Response = {
    mealId: string;
  };
}
