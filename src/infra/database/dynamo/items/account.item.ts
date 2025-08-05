import { Account } from "@application/entities/account.entity";

export class AccountItem {
  static readonly type = "Account";
  private readonly keys: AccountItem.Keys;

  constructor(private readonly attributes: AccountItem.Attributes) {
    this.keys = {
      PK: AccountItem.getPK(this.attributes.id),
      SK: AccountItem.getSK(this.attributes.id),
      GSI1PK: AccountItem.getGSI1PK(this.attributes.email),
      GSI1SK: AccountItem.getGSI1SK(this.attributes.email),
    };
  }

  static fromEntity(account: Account): AccountItem {
    return new AccountItem({
      ...account,
      createdAt: account.createdAt.toISOString(),
    });
  }

  static toEntity(item: AccountItem.ItemType): Account {
    return new Account({
      id: item.id,
      email: item.email,
      externalId: item.externalId,
      createdAt: new Date(item.createdAt),
    });
  }

  toDynamoItem(): AccountItem.ItemType {
    return {
      ...this.keys,
      ...this.attributes,
      type: AccountItem.type,
    };
  }

  static getPK(accountId: string): AccountItem.Keys["PK"] {
    return `ACCOUNT#${accountId}`;
  }

  static getSK(accountId: string): AccountItem.Keys["SK"] {
    return `ACCOUNT#${accountId}`;
  }

  static getGSI1PK(email: string): AccountItem.Keys["GSI1PK"] {
    return `ACCOUNT#${email}`;
  }

  static getGSI1SK(email: string): AccountItem.Keys["GSI1SK"] {
    return `ACCOUNT#${email}`;
  }
}

export namespace AccountItem {
  export type Keys = {
    PK: `ACCOUNT#${string}`;
    SK: `ACCOUNT#${string}`;
    GSI1PK: `ACCOUNT#${string}`;
    GSI1SK: `ACCOUNT#${string}`;
  };

  export type Attributes = {
    id: string;
    email: string;
    externalId: string | undefined;
    createdAt: string;
  };

  export type Type = {
    type: "Account";
  };

  export type ItemType = Keys & Attributes & Type;
}
