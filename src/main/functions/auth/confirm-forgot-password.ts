import "reflect-metadata";

import { Registry } from "@kernel/di/registry";

import { ConfirmForgotPasswordController } from "@application/controllers/auth/confirm-forgot-password.controller";
import { lambdaHttpAdapter } from "@main/adapters/lambda-http-adapter";

const controller = Registry.getInstance().resolve(
  ConfirmForgotPasswordController
);

export const handler = lambdaHttpAdapter(controller);
