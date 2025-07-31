import "reflect-metadata";

import { Registry } from "@kernel/di/registry";

import { CreateMealController } from "@application/controllers/meals/create-meal.controller";
import { lambdaHttpAdapter } from "@main/adapters/lambda-http-adapter";

const controller = Registry.getInstance().resolve(CreateMealController);

export const handler = lambdaHttpAdapter(controller);
