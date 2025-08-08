import { QueryCommand } from "@aws-sdk/lib-dynamodb";

import { Meal } from "@application/entities/meal.entity";
import { dynamoClient } from "@infra/clients/dynamo.client";
import { MealItem } from "@infra/database/dynamo/items/meal.item";
import { Injectable } from "@kernel/decorators/injectable";
import { AppConfig } from "@shared/config/app.config";

@Injectable()
export class ListMealsByDayQuery {
  constructor(private readonly appConfig: AppConfig) {}

  async execute({
    accountId,
    date,
  }: ListMealsByDayQuery.Input): Promise<ListMealsByDayQuery.Output> {
    const queryCommand = new QueryCommand({
      TableName: this.appConfig.database.dynamodb.mainTableName,
      IndexName: "GSI1",
      ProjectionExpression:
        "#GSI1PK, #id, #createdAt, #name, #icon, #foods, #status",
      KeyConditionExpression: "GSI1PK = :GSI1PK",
      FilterExpression: "#status = :status",
      ScanIndexForward: false, // Inverts order to show recent meals first
      ExpressionAttributeNames: {
        "#GSI1PK": "GSI1PK",
        "#id": "id",
        "#createdAt": "createdAt",
        "#name": "name",
        "#icon": "icon",
        "#foods": "foods",
        "#status": "status",
      },
      ExpressionAttributeValues: {
        ":GSI1PK": MealItem.getGSI1PK({ accountId, createdAt: date }),
        ":status": Meal.Status.SUCCESS,
      },
    });

    const { Items = [] } = await dynamoClient.send(queryCommand);

    const items = Items as ListMealsByDayQuery.MealItem[];

    const meals: ListMealsByDayQuery.Output["meals"] = items.map((item) => ({
      createdAt: item.createdAt,
      id: item.id,
      name: item.name,
      icon: item.icon,
      foods: item.foods,
    }));

    return {
      meals,
    };
  }
}

export namespace ListMealsByDayQuery {
  export type Input = {
    accountId: string;
    date: Date;
  };

  export type MealItem = {
    GSI1PK: string;
    createdAt: string;
    id: string;
    name: string;
    icon: string;
    foods: Meal.Food[];
  };

  export type Output = {
    meals: {
      id: string;
      createdAt: string;
      name: string;
      icon: string;
      foods: Meal.Food[];
    }[];
  };
}
