import { Profile } from "@application/entities/profile.entity";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoClient } from "@infra/clients/dynamo.client";
import { AccountItem } from "@infra/database/dynamo/items/account.item";
import { Injectable } from "@kernel/decorators/injectable";
import { AppConfig } from "@shared/config/app.config";

@Injectable()
export class GetProfileAndGoalQuery {
  constructor(private readonly config: AppConfig) {}

  async execute({
    accountId,
  }: GetProfileAndGoalQuery.Input): Promise<GetProfileAndGoalQuery.Output | void> {
    const queryCommand = new QueryCommand({
      TableName: this.config.database.dynamodb.mainTableName,
      Limit: 2,
      ProjectionExpression:
        "#PK, #SK, #name, #birthDate, #gender, #weight, #height, #calories, #proteins, #carbohydrates, #fats, #type",
      KeyConditionExpression: "#PK = :PK AND begins_with(#SK, :SK)",
      ExpressionAttributeNames: {
        "#PK": "PK",
        "#SK": "SK",
        "#name": "name",
        "#birthDate": "birthDate",
        "#gender": "gender",
        "#weight": "weight",
        "#height": "height",
        "#calories": "calories",
        "#proteins": "proteins",
        "#carbohydrates": "carbohydrates",
        "#fats": "fats",
        "#type": "type",
      },
      ExpressionAttributeValues: {
        ":PK": AccountItem.getPK(accountId),
        ":SK": `${AccountItem.getPK(accountId)}#`,
      },
    });

    const { Items = [] } = await dynamoClient.send(queryCommand);

    console.log(JSON.stringify(Items, null, 2));
  }
}

export namespace GetProfileAndGoalQuery {
  export type Input = {
    accountId: string;
  };

  export type Output = {
    profile: {
      name: string;
      birthDate: string;
      gender: Profile.Gender;
      weight: number;
      height: number;
    };
    goal: {
      calories: number;
      proteins: number;
      carbohydrates: number;
      fats: number;
    };
  };
}
