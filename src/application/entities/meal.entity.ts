import KSUID from "ksuid";

export class Meal {
  readonly id: string;
  readonly accountId: string;
  status: Meal.Status;
  attempts: number;
  inputType: Meal.InputType;
  inputFileKey: string;
  name: string;
  icon: string;
  foods: Meal.Food[];
  readonly createdAt: Date;
  externalId: string | undefined;

  constructor(attributes: Meal.Attributes) {
    this.id = attributes.id ?? KSUID.randomSync().string;
    this.createdAt = attributes.createdAt ?? new Date();
    this.accountId = attributes.accountId;
    this.status = attributes.status;
    this.attempts = attributes.attempts ?? 0;
    this.inputType = attributes.inputType;
    this.inputFileKey = attributes.inputFileKey;
    this.name = attributes.name ?? "";
    this.icon = attributes.icon ?? "";
    this.foods = attributes.foods ?? [];
  }
}

export namespace Meal {
  export type Attributes = {
    id?: string;
    accountId: string;
    status: Meal.Status;
    inputType: Meal.InputType;
    inputFileKey: string;
    attempts?: number;
    name?: string;
    icon?: string;
    foods?: Meal.Food[];
    createdAt?: Date;
  };

  export enum Status {
    UPLOADING = "UPLOADING",
    QUEUED = "QUEUED",
    PROCESSING = "PROCESSING",
    SUCCESS = "SUCCESS",
    FAILED = "FAILED",
  }

  export enum InputType {
    AUDIO = "AUDIO",
    PICTURE = "PICTURE",
  }

  export type Food = {
    name: string;
    quantity: string;
    calories: number;
    proteins: number;
    fats: number;
    carbohydrates: number;
  };
}
