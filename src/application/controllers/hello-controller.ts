import { Schema } from "@kernel/decorators/schema";

import { Controller } from "@application/contracts/controller";
import {
  HelloBody,
  helloSchema,
} from "@application/controllers/schemas/hello-schema";

@Schema(helloSchema)
export class HelloController extends Controller<unknown> {
  protected override async handle(
    request: Controller.Request<HelloBody>,
  ): Promise<Controller.Response<unknown>> {
    return {
      statusCode: 200,
      body: {
        parsedBody: request.body,
      },
    };
  }
}
