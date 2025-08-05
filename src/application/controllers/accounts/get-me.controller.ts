import { Injectable } from "@kernel/decorators/injectable";

import { Controller } from "@application/contracts/controller";
import { GetProfileAndGoalQuery } from "@application/query/get-profile-and-goal.query";

@Injectable()
export class GetMeController extends Controller<
  "private",
  GetMeController.Response
> {
  constructor(private readonly getProfileAndGoalQuery: GetProfileAndGoalQuery) {
    super();
  }

  protected override async handle({
    accountId,
  }: Controller.Request<"private">): Promise<
    Controller.Response<GetMeController.Response>
  > {
    await this.getProfileAndGoalQuery.execute({ accountId });

    return {
      statusCode: 200,
      body: {
        accountId,
      },
    };
  }
}

export namespace GetMeController {
  export type Response = {
    accountId: string;
  };
}
