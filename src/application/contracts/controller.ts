import { z } from "zod";

export abstract class Controller<TBody = undefined> {
  protected schema?: z.ZodSchema;

  protected abstract handle(
    request: Controller.Request,
  ): Promise<Controller.Response<TBody>>;

  public execute(
    request: Controller.Request,
  ): Promise<Controller.Response<TBody>> {
    if (this.schema) {
      this.schema.parse(request.body);
    }

    return this.handle(request);
  }
}

export namespace Controller {
  export type Request<
    TBody = Record<string, unknown>,
    TParams = Record<string, unknown>,
    TQueryParams = Record<string, unknown>,
  > = {
    body: TBody;
    params: TParams;
    queryParams: TQueryParams;
  };

  export type Response<TBody = Record<string, unknown>> = {
    statusCode: number;
    body?: TBody;
  };
}
