import "reflect-metadata";

import { HelloController } from "@application/controllers/hello.controller";
import { HelloUseCase } from "@application/use-cases/hello.usecase";

import { lambdaHttpAdapter } from "@main/adapters/lambda-http-adapter";

import { Registry } from "@kernel/di/registry";

const container = new Registry();

container.register(HelloUseCase);
container.register(HelloController);

const controller = container.resolve(HelloController);

export const handler = lambdaHttpAdapter(controller);
