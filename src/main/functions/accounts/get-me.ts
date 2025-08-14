import "reflect-metadata";

import { Registry } from "@kernel/di/registry";

import { GetMeController } from "@application/controllers/accounts/get-me.controller";
import { lambdaHttpAdapter } from "@main/adapters/lambda-http.adapter";

const controller = Registry.getInstance().resolve(GetMeController);

export const handler = lambdaHttpAdapter(controller);
