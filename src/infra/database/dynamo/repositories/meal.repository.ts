import { GetCommand, PutCommand, PutCommandInput } from "@aws-sdk/lib-dynamodb";

import { Meal } from "@application/entities/meal.entity";
import { dynamoClient } from "@infra/clients/dynamo.client";
import { Injectable } from "@kernel/decorators/injectable";
import { AppConfig } from "@shared/config/app.config";
import { MealItem } from "../items/meal.item";

@Injectable()
export class MealRepository {
  constructor(private readonly config: AppConfig) { }

  getPutCommand(meal: Meal): PutCommandInput {
    const mealItem = MealItem.fromEntity(meal);

    return {
      TableName: this.config.database.dynamodb.mainTableName,
      Item: mealItem.toDynamoItem(),
    };
  }

  async create(meal: Meal): Promise<void> {
    const putCommand = new PutCommand(this.getPutCommand(meal));

    await dynamoClient.send(putCommand);
  }

  async findById({ accountId, mealId }: MealRepository.FindByIdParams): Promise<Meal | null> {
    const getCommand = new GetCommand({
      TableName: this.config.database.dynamodb.mainTableName,
      Key: {
        PK: MealItem.getPK({ mealId, accountId }),
        SK: MealItem.getSK({ mealId, accountId })
      }
    })

    const { Item: mealItem } = await dynamoClient.send(getCommand);

    if (!mealItem) {
      return null;
    }

    return MealItem.toEntity(mealItem as MealItem.ItemType);
  }
}

export namespace MealRepository {
  export type FindByIdParams = {
    accountId: string;
    mealId: string;
  }
}
