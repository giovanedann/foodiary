import { ZodError } from "zod";
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";

import { Controller } from "../../application/contracts/controller";
import { lambdaBodyParser } from "../utils/lambda-body-parser";
import { ErrorCode } from "../../application/errors/error-codes";
import { lambdaErrorResponse } from "../utils/lambda-error-response";
import { HttpError } from "../../application/errors/http/http-error";

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

      return lambdaErrorResponse({
        code: ErrorCode.INTERNAL_SERVER_ERROR,
        message: "Internal server error",
        statusCode: 500,
      });
    }
  };
}
