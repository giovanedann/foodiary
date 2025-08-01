import { Injectable } from "@kernel/decorators/injectable";
import { Schema } from "@kernel/decorators/schema";

import { Controller } from "@application/contracts/controller";
import {
  ConfirmForgotPasswordBody,
  confirmForgotPasswordSchema,
} from "@application/controllers/auth/schemas/confirm-forgot-password.schema";
import { ConfirmForgotPasswordUseCase } from "@application/use-cases/auth/confirm-forgot-password.usecase";

@Injectable()
@Schema(confirmForgotPasswordSchema)
export class ConfirmForgotPasswordController extends Controller<
  "public",
  ConfirmForgotPasswordController.Response
> {
  constructor(
    private readonly forgotPasswordUseCase: ConfirmForgotPasswordUseCase
  ) {
    super();
  }

  protected override async handle({
    body,
  }: Controller.Request<"public", ConfirmForgotPasswordBody>): Promise<
    Controller.Response<ConfirmForgotPasswordController.Response>
  > {
    const { email, confirmationCode, password } = body;

    await this.forgotPasswordUseCase.execute({
      email,
      confirmationCode,
      password,
    });

    return {
      statusCode: 204,
    };
  }
}

export namespace ConfirmForgotPasswordController {
  export type Response = void;
}
