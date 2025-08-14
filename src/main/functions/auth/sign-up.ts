import "reflect-metadata";

import { Registry } from "@kernel/di/registry";

import { SignUpController } from "@application/controllers/auth/sign-up.controller";
import { lambdaHttpAdapter } from "@main/adapters/lambda-http.adapter";

const controller = Registry.getInstance().resolve(SignUpController);

export const handler = lambdaHttpAdapter(controller);
