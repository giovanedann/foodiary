import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { ZodError } from "zod";

import { Controller } from "@application/contracts/controller";
import { ErrorCode } from "@application/errors/error-codes";
import { HttpError } from "@application/errors/http/http-error";

import { lambdaBodyParser } from "@main/utils/lambda-body-parser";
import { lambdaErrorResponse } from "@main/utils/lambda-error-response";

export function lambdaHttpAdapter(controller: Controller<unknown>) {
  return async (
    event: APIGatewayProxyEventV2,
  ): Promise<APIGatewayProxyResultV2> => {
    try {
      const params = event.pathParameters || {};
      const queryParams = event.queryStringParameters || {};
      const body = lambdaBodyParser(event.body);

      const response = await controller.execute({
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
        return lambdaErrorResponse({
          code: ErrorCode.VALIDATION,
          message: error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
          statusCode: 400,
        });
      }

      if (error instanceof HttpError) {
        return lambdaErrorResponse(error);
      }

      // eslint-disable-next-line no-console
      console.log(error);

      return lambdaErrorResponse({
        code: ErrorCode.INTERNAL_SERVER_ERROR,
        message: "Internal server error",
        statusCode: 500,
      });
    }
  };
}
