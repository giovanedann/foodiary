import "reflect-metadata";

import { Registry } from "@kernel/di/registry";

import { GetMealByIdController } from "@application/controllers/meals/get-meal-by-id.controller";
import { lambdaHttpAdapter } from "@main/adapters/lambda-http.adapter";

const controller = Registry.getInstance().resolve(GetMealByIdController);

export const handler = lambdaHttpAdapter(controller);
