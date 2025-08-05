import { QueryCommand } from "@aws-sdk/lib-dynamodb";

import { Injectable } from "@kernel/decorators/injectable";

import { dynamoClient } from "@infra/clients/dynamo.client";
import { AccountItem } from "@infra/database/dynamo/items/account.item";
import { GoalItem } from "@infra/database/dynamo/items/goal.item";
import { ProfileItem } from "@infra/database/dynamo/items/profile.item";

import { AppConfig } from "@shared/config/app.config";

import { Profile } from "@application/entities/profile.entity";
import { ResourceNotFoundError } from "@application/errors/application/resource-not-found.error";

@Injectable()
export class GetProfileAndGoalQuery {
  constructor(private readonly config: AppConfig) {}

  async execute({
    accountId,
  }: GetProfileAndGoalQuery.Input): Promise<GetProfileAndGoalQuery.Output> {
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

    // Type narrowing (if return is true, the type IS something) to ensure we have the correct item types
    const profile = Items.find(
      (item): item is GetProfileAndGoalQuery.ProfileItem =>
        item.type === ProfileItem.type
    );
    const goal = Items.find(
      (item): item is GetProfileAndGoalQuery.GoalItem =>
        item.type === GoalItem.type
    );

    if (!profile || !goal) {
      throw new ResourceNotFoundError("Account not found");
    }

    return {
      profile: {
        name: profile.name,
        birthDate: profile.birthDate,
        gender: profile.gender,
        weight: profile.weight,
        height: profile.height,
      },
      goal: {
        calories: goal.calories,
        proteins: goal.proteins,
        carbohydrates: goal.carbohydrates,
        fats: goal.fats,
      },
    };
  }
}

export namespace GetProfileAndGoalQuery {
  export type Input = {
    accountId: string;
  };

  export type ProfileItem = {
    name: string;
    birthDate: string;
    gender: Profile.Gender;
    weight: number;
    height: number;
  };

  export type GoalItem = {
    calories: number;
    proteins: number;
    carbohydrates: number;
    fats: number;
  };

  export type Output = {
    profile: GetProfileAndGoalQuery.ProfileItem;
    goal: GetProfileAndGoalQuery.GoalItem;
  };
}
