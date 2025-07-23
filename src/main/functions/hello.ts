import "reflect-metadata";

import { HelloController } from "../../application/controllers/hello-controller";
import { lambdaHttpAdapter } from "../adapters/lambda-http-adapter";

const controller = new HelloController();

export const handler = lambdaHttpAdapter(controller);
