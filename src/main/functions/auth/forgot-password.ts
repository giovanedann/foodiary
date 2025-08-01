import "reflect-metadata";

import { Registry } from "@kernel/di/registry";

import { ForgotPasswordController } from "@application/controllers/auth/forgot-password.controller";
import { lambdaHttpAdapter } from "@main/adapters/lambda-http-adapter";

const controller = Registry.getInstance().resolve(ForgotPasswordController);

export const handler = lambdaHttpAdapter(controller);
