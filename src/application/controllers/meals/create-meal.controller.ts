import { Injectable } from "@kernel/decorators/injectable";

import { Controller } from "@application/contracts/controller";

@Injectable()
export class CreateMealController extends Controller<unknown> {
  protected override async handle(): Promise<
    Controller.Response<CreateMealController.Response>
  > {
    return {
      statusCode: 201,
      body: {
        message: "Meal created successfully",
      },
    };
  }
}

export namespace CreateMealController {
  export type Response = any;
}
