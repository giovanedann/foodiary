import { ZodError } from "zod";
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";

import { IController } from "../../application/contracts/controller";
import { lambdaBodyParser } from "../utils/lambda-body-parser";

export function lambdaHttpAdapter(controller: IController<unknown>) {
  return async (
    event: APIGatewayProxyEventV2,
  ): Promise<APIGatewayProxyResultV2> => {
    try {
      const params = event.pathParameters || {};
      const queryParams = event.queryStringParameters || {};
      const body = lambdaBodyParser(event.body);

      const response = await controller.handle({
        body,
        params,
        queryParams,
      });

      return {
        statusCode: response.statusCode,
        body: response.body ? JSON.stringify(response.body) : undefined,
      };
    } catch (error) {
      if (error instanceof ZodError) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            error: {
              code: "VALIDATION",
              message: error.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message,
              })),
            },
          }),
        };
      }

      return {
        statusCode: 500,
        body: JSON.stringify({
          error: {
            code: "INTERNAL_SERVER_ERROR",
            message: "An unexpected error occurred",
          },
        }),
      };
    }
  };
}
