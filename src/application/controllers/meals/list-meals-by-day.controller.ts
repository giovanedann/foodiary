import { Injectable } from "@kernel/decorators/injectable";

import { Controller } from "@application/contracts/controller";
import { Meal } from "@application/entities/meal.entity";
import { ListMealsByDayQuery } from "@application/query/list-meals-by-day.query";
import { listMealsByDaySchema } from "./schemas/list-meals-by-day.schema";

@Injectable()
export class ListMealsByDayController extends Controller<
  "private",
  ListMealsByDayController.Response
> {
  constructor(private readonly listMealsByDayQuery: ListMealsByDayQuery) {
    super();
  }

  protected override async handle({
    accountId,
    queryParams,
  }: Controller.Request<"private">): Promise<
    Controller.Response<ListMealsByDayController.Response>
  > {
    const { date } = listMealsByDaySchema.parse(queryParams);

    const { meals } = await this.listMealsByDayQuery.execute({
      accountId,
      date,
    });

    return {
      statusCode: 200,
      body: {
        meals,
      },
    };
  }
}

export namespace ListMealsByDayController {
  export type Response = {
    meals: {
      id: string;
      createdAt: string;
      name: string;
      icon: string;
      foods: Meal.Food[];
    }[];
  };
}
