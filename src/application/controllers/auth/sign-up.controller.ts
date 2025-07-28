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
export class SignUpController extends Controller<unknown> {
  constructor(private readonly signUpUseCase: SignUpUseCase) {
    super();
  }

  protected override async handle(
    { body }: Controller.Request<SignUpBody>,
  ): Promise<Controller.Response<SignUpController.Response>> {
    const { account } = body;

    const { accessToken, refreshToken } = await this.signUpUseCase.execute(account);

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
  }
}
