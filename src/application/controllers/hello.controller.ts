import { Injectable } from "@kernel/decorators/injectable";
import { Schema } from "@kernel/decorators/schema";

import { Controller } from "@application/contracts/controller";
import {
    HelloBody,
    helloSchema,
} from "@application/controllers/schemas/hello.schema";
import { HelloUseCase } from "@application/use-cases/hello.usecase";

@Injectable()
@Schema(helloSchema)
export class HelloController extends Controller<unknown> {
  constructor(private readonly helloUseCase: HelloUseCase) {
    super();
  }

  protected override async handle(
    request: Controller.Request<HelloBody>,
  ): Promise<Controller.Response<unknown>> {
    const result = await this.helloUseCase.execute({
      email: request.body.email,
    });

    return {
      statusCode: 200,
      body: {
        result,
      },
    };
  }
}
