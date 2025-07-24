import "reflect-metadata";

import { container } from "@kernel/di/container";

import { lambdaHttpAdapter } from "@main/adapters/lambda-http-adapter";

import { HelloController } from "@application/controllers/hello.controller";

const controller = container.resolve(HelloController);

export const handler = lambdaHttpAdapter(controller);
