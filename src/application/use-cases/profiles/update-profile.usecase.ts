import { Profile } from "@application/entities/profile.entity";
import { ResourceNotFoundError } from "@application/errors/application/resource-not-found.error";
import { ProfileRepository } from "@infra/database/dynamo/repositories/profile.repository";
import { Injectable } from "@kernel/decorators/injectable";

@Injectable()
export class UpdateProfileUseCase {
  constructor(private readonly profileRepository: ProfileRepository) { }

  async execute({ accountId, birthDate, name, weight, height, gender }: UpdateProfileUseCase.Input): Promise<UpdateProfileUseCase.Output> {
    const profile = await this.profileRepository.findByAccountId(accountId);

    if (!profile) {
      throw new ResourceNotFoundError("Profile not found");
    }

    profile.name = name;
    profile.weight = weight;
    profile.height = height;
    profile.gender = gender;
    profile.birthDate = birthDate;

    await this.profileRepository.save(profile);
  }
}

export namespace UpdateProfileUseCase {
  export type Input = {
    accountId: string;
    name: string;
    weight: number;
    height: number;
    birthDate: Date;
    gender: Profile.Gender;
  };

  export type Output = void;
}
