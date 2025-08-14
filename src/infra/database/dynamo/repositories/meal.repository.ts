import {
  GetCommand,
  PutCommand,
  PutCommandInput,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";

import { Meal } from "@application/entities/meal.entity";
import { dynamoClient } from "@infra/clients/dynamo.client";
import { Injectable } from "@kernel/decorators/injectable";
import { AppConfig } from "@shared/config/app.config";
import { MealItem } from "../items/meal.item";

@Injectable()
export class MealRepository {
  constructor(private readonly config: AppConfig) {}

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

  async save(profile: Meal): Promise<void> {
    const mealItem = MealItem.fromEntity(profile).toDynamoItem();

    const command = new UpdateCommand({
      TableName: this.config.database.dynamodb.mainTableName,
      Key: {
        PK: mealItem.PK,
        SK: mealItem.SK,
      },
      UpdateExpression:
        "SET #status = :status, #attempts = :attempts, #name = :name, #icon = :icon, #foods = :foods",
      ExpressionAttributeNames: {
        "#status": "status",
        "#attempts": "attempts",
        "#name": "name",
        "#icon": "icon",
        "#foods": "foods",
      },
      ExpressionAttributeValues: {
        ":status": mealItem.status,
        ":attempts": mealItem.attempts,
        ":name": mealItem.name,
        ":icon": mealItem.icon,
        ":foods": mealItem.foods,
      },
      ReturnValues: "NONE",
    });

    await dynamoClient.send(command);
  }

  async findById({
    accountId,
    mealId,
  }: MealRepository.FindByIdParams): Promise<Meal | null> {
    const getCommand = new GetCommand({
      TableName: this.config.database.dynamodb.mainTableName,
      Key: {
        PK: MealItem.getPK({ mealId, accountId }),
        SK: MealItem.getSK({ mealId, accountId }),
      },
    });

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
  };
}
