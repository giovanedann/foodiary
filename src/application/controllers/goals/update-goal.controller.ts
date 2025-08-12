import { Injectable } from "@kernel/decorators/injectable";

import { Controller } from "@application/contracts/controller";
import { UpdateGoalUseCase } from "@application/use-cases/goals/update-goal.usecase";
import { Schema } from "@kernel/decorators/schema";
import { UpdateGoalBody, updateGoalSchema } from "./schemas/update-goal.schema";

@Injectable()
@Schema(updateGoalSchema)
export class UpdateGoalController extends Controller<
  "private",
  UpdateGoalController.Response
> {
  constructor(private readonly updateGoalUseCase: UpdateGoalUseCase) {
    super();
  }

  protected override async handle({
    accountId,
    body,
  }: Controller.Request<"private", UpdateGoalBody>): Promise<
    Controller.Response<UpdateGoalController.Response>
  > {
    const { proteins, carbohydrates, fats, calories } = body;

    await this.updateGoalUseCase.execute({
      accountId,
      proteins,
      carbohydrates,
      fats,
      calories,
    });

    return {
      statusCode: 204,
    };
  }
}

export namespace UpdateGoalController {
  export type Request = {
    accountId: string;
    body: UpdateGoalBody;
  };

  export type Response = null;
}
