import { Injectable } from "@kernel/decorators/injectable";

import { Account } from "@application/entities/account.entity";
import { Goal } from "@application/entities/goal.entity";
import { Profile } from "@application/entities/profile.entity";

import { EmailAlreadyInUseError } from "@application/errors/application/email-already-in-use.error";

import { AccountRepository } from "@infra/database/dynamo/repositories/account.repository";

import { SignUpUnitOfWork } from "@infra/database/dynamo/unity-of-work/sign-up-unity-of-work";
import { AuthGateway } from "@infra/gateways/auth.gateway";

@Injectable()
export class SignUpUseCase {
  constructor(
    private readonly authGateway: AuthGateway,
    private readonly accountRepository: AccountRepository,
    private readonly signUpUnitOfWork: SignUpUnitOfWork
  ) {}

  async execute({
    account,
    profile,
  }: SignUpUseCase.Input): Promise<SignUpUseCase.Output> {
    const existingAccount = await this.accountRepository.findByEmail(
      account.email
    );

    if (existingAccount) {
      throw new EmailAlreadyInUseError();
    }

    const accountEntity = new Account({ email: account.email });
    const profileEntity = new Profile({
      ...profile,
      accountId: accountEntity.id,
    });
    const goalEntity = new Goal({
      accountId: accountEntity.id,
      calories: 2500,
      carbohydrates: 500,
      fats: 100,
      proteins: 180,
    });

    await this.signUpUnitOfWork.run({
      account: accountEntity,
      goal: goalEntity,
      profile: profileEntity,
    });

    const { externalId } = await this.authGateway.signUp({
      email: account.email,
      password: account.password,
      internalId: accountEntity.id,
    });

    accountEntity.externalId = externalId;

    await this.accountRepository.create(accountEntity);

    const { accessToken, refreshToken } = await this.authGateway.signIn({
      email: account.email,
      password: account.password,
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}

export namespace SignUpUseCase {
  export type Input = {
    account: {
      email: string;
      password: string;
    };

    profile: {
      name: string;
      birthDate: Date;
      gender: Profile.Gender;
      height: number;
      weight: number;
      activityLevel: Profile.ActivityLevel;
    };
  };

  export type Output = {
    accessToken: string;
    refreshToken: string;
  };
}
