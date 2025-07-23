import { z } from "zod";
import { IController } from "../contracts/controller";

const schema = z.object({
  name: z.string().min(1, { error: "Name is required" }),
  email: z
    .email({ error: "Email is invalid" })
    .min(1, { error: "Email is required" }),
});

export class HelloController implements IController<unknown> {
  async handle(
    request: IController.Request,
  ): Promise<IController.Response<unknown>> {
    const parsedBody = schema.parse(request.body);

    return {
      statusCode: 200,
      body: parsedBody,
    };
  }
}
