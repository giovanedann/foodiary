import { Injectable } from "@kernel/decorators/injectable";
import { Schema } from "@kernel/decorators/schema";

import { Controller } from "@application/contracts/controller";
import {
  SignUpBody,
  signUpSchema,
} from "@application/controllers/auth/schemas/sign-up.schema";
import { SignUpUseCase } from "@application/use-cases/auth/sign-up.usecase";

@Injectable()
@Schema(signUpSchema)
export class SignUpController extends Controller<
  "public",
  SignUpController.Response
> {
  constructor(private readonly signUpUseCase: SignUpUseCase) {
    super();
  }

  protected override async handle({
    body,
  }: Controller.Request<"public", SignUpBody>): Promise<
    Controller.Response<SignUpController.Response>
  > {
    const { account, profile } = body;

    const { accessToken, refreshToken } = await this.signUpUseCase.execute({
      account,
      profile,
    });

    return {
      statusCode: 200,
      body: {
        accessToken,
        refreshToken,
      },
    };
  }
}

export namespace SignUpController {
  export type Response = {
    accessToken: string;
    refreshToken: string;
  };
}
