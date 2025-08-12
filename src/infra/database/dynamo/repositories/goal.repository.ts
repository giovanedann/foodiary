import {
  GetCommand,
  PutCommand,
  PutCommandInput,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";

import { Goal } from "@application/entities/goal.entity";
import { dynamoClient } from "@infra/clients/dynamo.client";
import { GoalItem } from "@infra/database/dynamo/items/goal.item";
import { Injectable } from "@kernel/decorators/injectable";
import { AppConfig } from "@shared/config/app.config";

@Injectable()
export class GoalRepository {
  constructor(private readonly config: AppConfig) {}

  getPutCommand(goal: Goal): PutCommandInput {
    const goalItem = GoalItem.fromEntity(goal);

    return {
      TableName: this.config.database.dynamodb.mainTableName,
      Item: goalItem.toDynamoItem(),
    };
  }

  async create(goal: Goal): Promise<void> {
    const putCommand = new PutCommand(this.getPutCommand(goal));

    await dynamoClient.send(putCommand);
  }

  async save(goal: Goal): Promise<void> {
    const goalItem = GoalItem.fromEntity(goal).toDynamoItem();

    const command = new UpdateCommand({
      TableName: this.config.database.dynamodb.mainTableName,
      Key: {
        PK: goalItem.PK,
        SK: goalItem.SK,
      },
      UpdateExpression:
        "SET #calories = :calories, #proteins = :proteins, #carbohydrates = :carbohydrates, #fats = :fats",
      ExpressionAttributeNames: {
        "#calories": "calories",
        "#proteins": "proteins",
        "#carbohydrates": "carbohydrates",
        "#fats": "fats",
      },
      ExpressionAttributeValues: {
        ":calories": goalItem.calories,
        ":proteins": goalItem.proteins,
        ":carbohydrates": goalItem.carbohydrates,
        ":fats": goalItem.fats,
      },
      ReturnValues: "NONE",
    });

    await dynamoClient.send(command);
  }

  async findByAccountId(accountId: string): Promise<Goal | null> {
    const getCommand = new GetCommand({
      TableName: this.config.database.dynamodb.mainTableName,
      Key: {
        PK: GoalItem.getPK(accountId),
        SK: GoalItem.getSK(accountId),
      },
    });

    const { Item: goalItem } = await dynamoClient.send(getCommand);

    if (!goalItem) {
      return null;
    }

    return GoalItem.toEntity(goalItem as GoalItem.ItemType);
  }
}
