import { PutCommand, PutCommandInput } from "@aws-sdk/lib-dynamodb";

import { Profile } from "@application/entities/profile.entity";
import { dynamoClient } from "@infra/clients/dynamo.client";
import { ProfileItem } from "@infra/database/dynamo/items/profile.item";
import { Injectable } from "@kernel/decorators/injectable";
import { AppConfig } from "@shared/config/app.config";

@Injectable()
export class ProfileRepository {
  constructor(private readonly config: AppConfig) {}

  getPutCommand(profile: Profile): PutCommandInput {
    const profileItem = ProfileItem.fromEntity(profile);

    return {
      TableName: this.config.database.dynamodb.mainTableName,
      Item: profileItem.toDynamoItem(),
    };
  }

  async create(profile: Profile): Promise<void> {
    const putCommand = new PutCommand(this.getPutCommand(profile));
    await dynamoClient.send(putCommand);
  }
}
