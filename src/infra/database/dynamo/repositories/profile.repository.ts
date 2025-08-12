import { GetCommand, PutCommand, PutCommandInput, UpdateCommand } from "@aws-sdk/lib-dynamodb";

import { Profile } from "@application/entities/profile.entity";
import { dynamoClient } from "@infra/clients/dynamo.client";
import { ProfileItem } from "@infra/database/dynamo/items/profile.item";
import { Injectable } from "@kernel/decorators/injectable";
import { AppConfig } from "@shared/config/app.config";

@Injectable()
export class ProfileRepository {
  constructor(private readonly config: AppConfig) { }

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

  async save(profile: Profile): Promise<void> {
    const profileItem = ProfileItem.fromEntity(profile).toDynamoItem();

    const command = new UpdateCommand({
      TableName: this.config.database.dynamodb.mainTableName,
      Key: {
        PK: profileItem.PK,
        SK: profileItem.SK
      },
      UpdateExpression: "SET #name = :name, #weight = :weight, #height = :height, #birthDate = :birthDate, #gender = :gender",
      ExpressionAttributeNames: {
        "#name": "name",
        "#weight": "weight",
        "#height": "height",
        "#birthDate": "birthDate",
        "#gender": "gender"
      },
      ExpressionAttributeValues: {
        ":name": profileItem.name,
        ":weight": profileItem.weight,
        ":height": profileItem.height,
        ":birthDate": profileItem.birthDate,
        ":gender": profileItem.gender
      },
      ReturnValues: "NONE",
    });

    await dynamoClient.send(command);
  }

  async findByAccountId(accountId: string): Promise<Profile | null> {
    const getCommand = new GetCommand({
      TableName: this.config.database.dynamodb.mainTableName,
      Key: {
        PK: ProfileItem.getPK(accountId),
        SK: ProfileItem.getSK(accountId),
      }
    });

    const { Item: profileItem } = await dynamoClient.send(getCommand);

    if (!profileItem) {
      return null;
    }

    return ProfileItem.toEntity(profileItem as ProfileItem.ItemType);
  }
}
