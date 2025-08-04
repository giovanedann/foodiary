export class Profile {
  readonly accountId: string;
  name: string;
  birthDate: Date;
  gender: Profile.Gender;
  height: number;
  weight: number;
  activityLevel: Profile.ActivityLevel;
  readonly createdAt: Date;

  constructor(attributes: Profile.Attributes) {
    this.accountId = attributes.accountId;
    this.name = attributes.name;
    this.birthDate = attributes.birthDate;
    this.gender = attributes.gender;
    this.height = attributes.height;
    this.weight = attributes.weight;
    this.activityLevel = attributes.activityLevel;
    this.createdAt = attributes.createdAt ?? new Date();
  }
}

export namespace Profile {
  export type Attributes = {
    accountId: string;
    name: string;
    birthDate: Date;
    gender: Profile.Gender;
    height: number;
    weight: number;
    activityLevel: Profile.ActivityLevel;
    createdAt?: Date;
  };

  export enum Gender {
    MALE = "MALE",
    FEMALE = "FEMALE",
  }

  export enum ActivityLevel {
    SEDENTARY = "SEDENTARY",
    LIGHT = "LIGHT",
    MODERATE = "MODERATE",
    HEAVY = "HEAVY",
    ATHLETE = "ATHLETE",
  }
}
