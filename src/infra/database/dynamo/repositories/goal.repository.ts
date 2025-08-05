import { PutCommand, PutCommandInput } from "@aws-sdk/lib-dynamodb";

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
}
