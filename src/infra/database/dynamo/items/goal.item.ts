import { Goal } from "@application/entities/goal.entity";
import { AccountItem } from "./account.item";

export class GoalItem {
  private readonly type = "Goal";
  private readonly keys: GoalItem.Keys;

  constructor(private readonly attributes: GoalItem.Attributes) {
    this.keys = {
      PK: GoalItem.getPK(this.attributes.accountId),
      SK: GoalItem.getSK(this.attributes.accountId),
    };
  }

  static fromEntity(goal: Goal): GoalItem {
    return new GoalItem({
      ...goal,
      createdAt: goal.createdAt.toISOString(),
    });
  }

  static toEntity(item: GoalItem.ItemType): Goal {
    return new Goal({
      accountId: item.accountId,
      calories: item.calories,
      proteins: item.proteins,
      carbohydrates: item.carbohydrates,
      fats: item.fats,
      createdAt: new Date(item.createdAt),
    });
  }

  toDynamoItem(): GoalItem.ItemType {
    return {
      ...this.keys,
      ...this.attributes,
      type: this.type,
    };
  }

  static getPK(accountId: string): GoalItem.Keys["PK"] {
    return `ACCOUNT#${accountId}`;
  }

  static getSK(accountId: string): GoalItem.Keys["SK"] {
    return `ACCOUNT#${accountId}#GOAL`;
  }
}

export namespace GoalItem {
  export type Keys = {
    PK: AccountItem.Keys["PK"];
    SK: `ACCOUNT#${string}#GOAL`;
  };

  export type Attributes = {
    accountId: string;
    calories: number;
    proteins: number;
    carbohydrates: number;
    fats: number;
    createdAt: string;
  };

  export type Type = {
    type: "Goal";
  };

  export type ItemType = Keys & Attributes & Type;
}
