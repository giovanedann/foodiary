import "reflect-metadata";

import { Registry } from "@kernel/di/registry";

import { SignInController } from "@application/controllers/auth/sign-in.controller";
import { lambdaHttpAdapter } from "@main/adapters/lambda-http.adapter";

const controller = Registry.getInstance().resolve(SignInController);

export const handler = lambdaHttpAdapter(controller);
