import KSUID from "ksuid";

export class Account {
  readonly id: string;
  readonly email: string;
  externalId: string;

  constructor(attributes: Account.Attributes) {
    this.id = KSUID.randomSync().string;
    this.email = attributes.email;
    this.externalId = attributes.externalId;
  }
}

export namespace Account {
  export type Attributes = {
    email: string;
    externalId: string;
  };
}
