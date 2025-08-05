import { Injectable } from "@kernel/decorators/injectable";

import { Account } from "@application/entities/account.entity";
import { Goal } from "@application/entities/goal.entity";
import { Profile } from "@application/entities/profile.entity";

import { EmailAlreadyInUseError } from "@application/errors/application/email-already-in-use.error";

import { AccountRepository } from "@infra/database/dynamo/repositories/account.repository";
import { SignUpUnitOfWork } from "@infra/database/dynamo/unity-of-work/sign-up-unity-of-work";
import { AuthGateway } from "@infra/gateways/auth.gateway";

import { GoalCalculatorService } from "@application/services/goal-calculator.service";
import { Saga } from "@shared/saga/saga";

@Injectable()
export class SignUpUseCase {
  constructor(
    private readonly authGateway: AuthGateway,
    private readonly accountRepository: AccountRepository,
    private readonly signUpUnitOfWork: SignUpUnitOfWork,
    private readonly saga: Saga
  ) {}

  async execute({
    account,
    profile,
  }: SignUpUseCase.Input): Promise<SignUpUseCase.Output> {
    return await this.saga.run(async () => {
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

      const goalMacros = GoalCalculatorService.calculate(profileEntity);
      const goalEntity = new Goal({
        accountId: accountEntity.id,
        calories: goalMacros.calories,
        carbohydrates: goalMacros.carbohydrates,
        fats: goalMacros.fats,
        proteins: goalMacros.proteins,
      });

      const { externalId } = await this.authGateway.signUp({
        email: account.email,
        password: account.password,
        internalId: accountEntity.id,
      });

      this.saga.addCompensation(() =>
        this.authGateway.deleteUser({ externalId })
      );

      accountEntity.externalId = externalId;

      await this.signUpUnitOfWork.run({
        account: accountEntity,
        goal: goalEntity,
        profile: profileEntity,
      });

      await this.accountRepository.create(accountEntity);

      const { accessToken, refreshToken } = await this.authGateway.signIn({
        email: account.email,
        password: account.password,
      });

      return {
        accessToken,
        refreshToken,
      };
    });
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
      goal: Profile.Goal;
      activityLevel: Profile.ActivityLevel;
    };
  };

  export type Output = {
    accessToken: string;
    refreshToken: string;
  };
}
