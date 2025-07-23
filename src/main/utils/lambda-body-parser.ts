import { APIGatewayProxyEventV2 } from "aws-lambda";

import { BadRequestError } from "@application/errors/http/bad-request";

export function lambdaBodyParser(body: APIGatewayProxyEventV2["body"]) {
  try {
    if (!body) {
      return {};
    }

    return JSON.parse(body);
  } catch {
    throw new BadRequestError("Malformed body");
  }
}
