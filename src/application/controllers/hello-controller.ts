import { z } from "zod";
import { Controller } from "../contracts/controller";

const schema = z.object({
  name: z.string().min(1, { error: "Name is required" }),
  email: z
    .email({ error: "Email is invalid" })
    .min(1, { error: "Email is required" }),
});

export class HelloController extends Controller<unknown> {
  protected override schema = schema;

  protected override async handle(
    request: Controller.Request,
  ): Promise<Controller.Response<unknown>> {
    return {
      statusCode: 200,
      body: {
        parsedBody: request.body,
      },
    };
  }
}
