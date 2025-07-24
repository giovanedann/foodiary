import "reflect-metadata";

import { Registry } from "@kernel/di/registry";

import { HelloController } from "@application/controllers/hello.controller";

import { lambdaHttpAdapter } from "@main/adapters/lambda-http-adapter";

const controller = Registry.getInstance().resolve(HelloController);

export const handler = lambdaHttpAdapter(controller);
