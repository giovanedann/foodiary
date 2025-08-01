import { Account } from "@application/entities/account.entity";
import { EmailAlreadyInUseError } from "@application/errors/application/email-already-in-use.error";
import { AccountRepository } from "@infra/database/dynamo/repositories/account.repository";
import { AuthGateway } from "@infra/gateways/auth.gateway";
import { Injectable } from "@kernel/decorators/injectable";

@Injectable()
export class SignUpUseCase {
  constructor(
    private readonly authGateway: AuthGateway,
    private readonly accountRepository: AccountRepository
  ) {}

  async execute({
    email,
    password,
  }: SignUpUseCase.Input): Promise<SignUpUseCase.Output> {
    const existingAccount = await this.accountRepository.findByEmail(email);

    if (existingAccount) {
      throw new EmailAlreadyInUseError();
    }

    const account = new Account({ email });

    const { externalId } = await this.authGateway.signUp({
      email,
      password,
      internalId: account.id,
    });

    account.externalId = externalId;

    await this.accountRepository.create(account);

    const { accessToken, refreshToken } = await this.authGateway.signIn({
      email,
      password,
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}

export namespace SignUpUseCase {
  export type Input = {
    email: string;
    password: string;
  };

  export type Output = {
    accessToken: string;
    refreshToken: string;
  };
}
