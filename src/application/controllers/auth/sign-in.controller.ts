import { Injectable } from "@kernel/decorators/injectable";
import { Schema } from "@kernel/decorators/schema";

import { Controller } from "@application/contracts/controller";
import {
  SignInBody,
  signInSchema,
} from "@application/controllers/auth/schemas/sign-in.schema";
import { SignInUseCase } from "@application/use-cases/auth/sign-in.usecase";

@Injectable()
@Schema(signInSchema)
export class SignInController extends Controller<unknown> {
  constructor(private readonly signInUseCase: SignInUseCase) {
    super();
  }

  protected override async handle({
    body,
  }: Controller.Request<SignInBody>): Promise<
    Controller.Response<SignInController.Response>
  > {
    const { email, password } = body;

    const { accessToken, refreshToken } = await this.signInUseCase.execute({
      email,
      password,
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

export namespace SignInController {
  export type Response = {
    accessToken: string;
    refreshToken: string;
  };
}
