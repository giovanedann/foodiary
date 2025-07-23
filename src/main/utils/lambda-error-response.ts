import { ErrorCode } from "@application/errors/error-codes";

interface ILambdaErrorResponseParams {
  statusCode: number;
  code: ErrorCode;
  message: any;
}

export function lambdaErrorResponse({
  code,
  message,
  statusCode,
}: ILambdaErrorResponseParams) {
  return {
    statusCode,
    body: JSON.stringify({
      message,
      code,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  };
}
