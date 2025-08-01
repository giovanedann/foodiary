import KSUID from "ksuid";

export class Account {
  readonly id: string;
  readonly email: string;
  readonly createdAt: Date;
  externalId: string | undefined;

  constructor(attributes: Account.Attributes) {
    this.id = attributes.id ?? KSUID.randomSync().string;
    this.email = attributes.email;
    this.externalId = attributes.externalId;
    this.createdAt = attributes.createdAt ?? new Date();
  }
}

export namespace Account {
  export type Attributes = {
    email: string;
    externalId?: string;
    id?: string;
    createdAt?: Date;
  };
}
