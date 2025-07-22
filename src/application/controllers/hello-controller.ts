import { IController } from "../contracts/controller";
export class HelloController implements IController<unknown> {
  async handle(
    request: IController.Request,
  ): Promise<IController.Response<unknown>> {
    return {
      statusCode: 200,
      body: request,
    };
  }
}
