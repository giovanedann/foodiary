import "reflect-metadata";

import { HelloController } from "@application/controllers/hello.controller";
import { HelloUseCase } from "@application/use-cases/hello.usecase";

import { lambdaHttpAdapter } from "@main/adapters/lambda-http-adapter";

const controller = new HelloController(new HelloUseCase());

export const handler = lambdaHttpAdapter(controller);
