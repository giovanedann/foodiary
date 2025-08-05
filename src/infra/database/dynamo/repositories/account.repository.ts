import {
  PutCommand,
  PutCommandInput,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";

import { Account } from "@application/entities/account.entity";
import { dynamoClient } from "@infra/clients/dynamo.client";
import { Injectable } from "@kernel/decorators/injectable";
import { AppConfig } from "@shared/config/app.config";
import { AccountItem } from "../items/account.item";

@Injectable()
export class AccountRepository {
  constructor(private readonly config: AppConfig) {}

  getPutCommand(account: Account): PutCommandInput {
    const accountItem = AccountItem.fromEntity(account);

    return {
      TableName: this.config.database.dynamodb.mainTableName,
      Item: accountItem.toDynamoItem(),
    };
  }

  async findByEmail(email: string): Promise<Account | null> {
    const queryCommand = new QueryCommand({
      IndexName: "GSI1",
      TableName: this.config.database.dynamodb.mainTableName,
      Limit: 1,
      KeyConditionExpression: "#GSI1PK = :GSI1PK AND #GSI1SK = :GSI1SK",
      ExpressionAttributeNames: {
        "#GSI1PK": "GSI1PK",
        "#GSI1SK": "GSI1SK",
      },
      ExpressionAttributeValues: {
        ":GSI1PK": AccountItem.getGSI1PK(email),
        ":GSI1SK": AccountItem.getGSI1SK(email),
      },
    });

    const { Items = [] } = await dynamoClient.send(queryCommand);

    const [account] = Items;

    if (!account) {
      return null;
    }

    return AccountItem.toEntity(account as AccountItem.ItemType);
  }

  async create(account: Account): Promise<void> {
    const putCommand = new PutCommand(this.getPutCommand(account));

    await dynamoClient.send(putCommand);
  }
}
