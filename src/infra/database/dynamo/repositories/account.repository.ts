import { PutCommand } from "@aws-sdk/lib-dynamodb";

import { Account } from "@application/entities/account.entity";
import { dynamoClient } from "@infra/clients/dynamo.client";
import { Injectable } from "@kernel/decorators/injectable";
import { AppConfig } from "@shared/config/app.config";
import { AccountItem } from "../items/account.item";

@Injectable()
export class AccountRepository {
  constructor(private readonly config: AppConfig) {}

  async create(account: Account): Promise<void> {
    const accountItem = AccountItem.fromEntity(account);

    const command = new PutCommand({
      TableName: this.config.database.dynamodb.mainTableName,
      Item: accountItem.toDynamoItem(),
    });

    await dynamoClient.send(command);
  }
}
