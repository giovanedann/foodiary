import { Profile } from "@application/entities/profile.entity";
import { AccountItem } from "./account.item";

export class ProfileItem {
  private readonly type = "Profile";
  private readonly keys: ProfileItem.Keys;

  constructor(private readonly attributes: ProfileItem.Attributes) {
    this.keys = {
      PK: ProfileItem.getPK(this.attributes.accountId),
      SK: ProfileItem.getSK(this.attributes.accountId),
    };
  }

  static fromEntity(profile: Profile): ProfileItem {
    return new ProfileItem({
      ...profile,
      createdAt: profile.createdAt.toISOString(),
      birthDate: profile.birthDate.toISOString(),
    });
  }

  static toEntity(item: ProfileItem.ItemType): Profile {
    return new Profile({
      accountId: item.accountId,
      name: item.name,
      birthDate: new Date(item.birthDate),
      gender: item.gender,
      height: item.height,
      weight: item.weight,
      activityLevel: item.activityLevel,
      createdAt: new Date(item.createdAt),
    });
  }

  toDynamoItem(): ProfileItem.ItemType {
    return {
      ...this.keys,
      ...this.attributes,
      type: this.type,
    };
  }

  static getPK(accountId: string): ProfileItem.Keys["PK"] {
    return `ACCOUNT#${accountId}`;
  }

  static getSK(accountId: string): ProfileItem.Keys["SK"] {
    return `ACCOUNT#${accountId}#PROFILE`;
  }
}

export namespace ProfileItem {
  export type Keys = {
    PK: AccountItem.Keys["PK"];
    SK: `ACCOUNT#${string}#PROFILE`;
  };

  export type Attributes = {
    accountId: string;
    name: string;
    birthDate: string;
    gender: Profile.Gender;
    height: number;
    weight: number;
    activityLevel: Profile.ActivityLevel;
    createdAt: string;
  };

  export type Type = {
    type: "Profile";
  };

  export type ItemType = Keys & Attributes & Type;
}
