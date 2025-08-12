import "reflect-metadata";

import { Registry } from "@kernel/di/registry";

import { UpdateGoalController } from "@application/controllers/goals/update-goal.controller";
import { lambdaHttpAdapter } from "@main/adapters/lambda-http-adapter";

const controller = Registry.getInstance().resolve(UpdateGoalController);

export const handler = lambdaHttpAdapter(controller);
