import { Injectable } from "@kernel/decorators/injectable";

import { Account } from "@application/entities/account.entity";
import { Goal } from "@application/entities/goal.entity";
import { Profile } from "@application/entities/profile.entity";

import { AccountRepository } from "../repositories/account.repository";
import { GoalRepository } from "../repositories/goal.repository";
import { ProfileRepository } from "../repositories/profile.repository";
import { UnitOfWork } from "./unit-of-work";

@Injectable()
export class SignUpUnitOfWork extends UnitOfWork {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly profileRepository: ProfileRepository,
    private readonly goalRepository: GoalRepository
  ) {
    super();
  }

  async run({ account, goal, profile }: SignUpUnitOfWork.RunParams) {
    this.addPut(this.accountRepository.getPutCommand(account));
    this.addPut(this.profileRepository.getPutCommand(profile));
    this.addPut(this.goalRepository.getPutCommand(goal));

    await this.commit();
  }
}

export namespace SignUpUnitOfWork {
  export type RunParams = {
    account: Account;
    profile: Profile;
    goal: Goal;
  };
}
