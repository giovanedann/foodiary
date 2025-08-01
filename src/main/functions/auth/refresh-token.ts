import "reflect-metadata";

import { Registry } from "@kernel/di/registry";

import { RefreshTokenController } from "@application/controllers/auth/refresh-token.controller";
import { lambdaHttpAdapter } from "@main/adapters/lambda-http-adapter";

const controller = Registry.getInstance().resolve(RefreshTokenController);

export const handler = lambdaHttpAdapter(controller);
