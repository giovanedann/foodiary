import { Controller } from "../contracts/controller";
import { HelloBody, helloSchema } from "./schemas/hello-schema";

export class HelloController extends Controller<unknown> {
  protected override schema = helloSchema;

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
