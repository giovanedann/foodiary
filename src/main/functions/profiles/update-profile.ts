import "reflect-metadata";

import { Registry } from "@kernel/di/registry";

import { UpdateProfileController } from "@application/controllers/profiles/update-profile.controller";
import { lambdaHttpAdapter } from "@main/adapters/lambda-http.adapter";

const controller = Registry.getInstance().resolve(UpdateProfileController);

export const handler = lambdaHttpAdapter(controller);
