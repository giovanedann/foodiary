import { Meal } from "@application/entities/meal.entity";

export class MealItem {
  static readonly type = "Meal";
  private readonly keys: MealItem.Keys;

  constructor(private readonly attributes: MealItem.Attributes) {
    this.keys = {
      PK: MealItem.getPK(this.attributes.id),
      SK: MealItem.getSK(this.attributes.id),
      GSI1PK: MealItem.getGSI1PK({
        accountId: this.attributes.accountId,
        createdAt: new Date(this.attributes.createdAt),
      }),
      GSI1SK: MealItem.getGSI1SK(this.attributes.id),
    };
  }

  static fromEntity(account: Meal): MealItem {
    return new MealItem({
      ...account,
      createdAt: account.createdAt.toISOString(),
    });
  }

  static toEntity(item: MealItem.ItemType): Meal {
    return new Meal({
      id: item.id,
      accountId: item.accountId,
      status: item.status,
      attempts: item.attempts,
      inputType: item.inputType,
      inputFileKey: item.inputFileKey,
      name: item.name,
      icon: item.icon,
      foods: item.foods,
      createdAt: new Date(item.createdAt),
    });
  }

  toDynamoItem(): MealItem.ItemType {
    return {
      ...this.keys,
      ...this.attributes,
      type: MealItem.type,
    };
  }

  static getPK(mealId: string): MealItem.Keys["PK"] {
    return `MEAL#${mealId}`;
  }

  static getSK(mealId: string): MealItem.Keys["SK"] {
    return `MEAL#${mealId}`;
  }

  static getGSI1PK({
    accountId,
    createdAt,
  }: MealItem.GSI1PKParams): MealItem.Keys["GSI1PK"] {
    const year = createdAt.getFullYear();
    const month = String(createdAt.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(createdAt.getDate()).padStart(2, "0");

    return `MEALS#${accountId}#${year}-${month}-${day}`;
  }

  static getGSI1SK(mealId: string): MealItem.Keys["GSI1SK"] {
    return `MEAL#${mealId}`;
  }
}

export namespace MealItem {
  type DateString = `${string}-${string}-${string}`; // YYYY-MM-DD

  export type Keys = {
    PK: `MEAL#${string}`;
    SK: `MEAL#${string}`;
    GSI1PK: `MEALS#${string}#${DateString}`;
    GSI1SK: `MEAL#${string}`;
  };

  export type Attributes = {
    id: string;
    accountId: string;
    status: Meal.Status;
    attempts: number;
    inputType: Meal.InputType;
    inputFileKey: string;
    name: string;
    icon: string;
    foods: Meal.Food[];
    createdAt: string;
  };

  export type Type = {
    type: "Meal";
  };

  export type ItemType = Keys & Attributes & Type;

  export type GSI1PKParams = {
    accountId: string;
    createdAt: Date;
  };
}
