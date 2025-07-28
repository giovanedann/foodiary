import { Injectable } from "@kernel/decorators/injectable";

@Injectable()
export class SignUpUseCase {
  async execute(input: SignUpUseCase.Input): Promise<SignUpUseCase.Output> {
    return {
      accessToken: "mocked-access-token",
      refreshToken: "mocked-refresh-token",
    };
  }
}

export namespace SignUpUseCase {
  export type Input = {
    email: string;
    password: string;
  }

  export type Output = {
    accessToken: string;
    refreshToken: string;
  }
}
