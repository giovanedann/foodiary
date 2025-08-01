import { Injectable } from "@kernel/decorators/injectable";

import { Controller } from "@application/contracts/controller";

@Injectable()
export class CreateMealController extends Controller<
  "private",
  CreateMealController.Response
> {
  protected override async handle({
    accountId,
  }: Controller.Request<"private">): Promise<
    Controller.Response<CreateMealController.Response>
  > {
    return {
      statusCode: 201,
      body: {
        accountId: accountId,
        message: "Meal created successfully",
      },
    };
  }
}

export namespace CreateMealController {
  export type Response = {
    accountId: string;
    message: string;
  };
}
