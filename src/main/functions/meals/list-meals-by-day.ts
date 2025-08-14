import "reflect-metadata";

import { Registry } from "@kernel/di/registry";

import { ListMealsByDayController } from "@application/controllers/meals/list-meals-by-day.controller";
import { lambdaHttpAdapter } from "@main/adapters/lambda-http.adapter";

const controller = Registry.getInstance().resolve(ListMealsByDayController);

export const handler = lambdaHttpAdapter(controller);
