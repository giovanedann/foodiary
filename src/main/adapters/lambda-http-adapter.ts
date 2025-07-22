import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { lambdaBodyParser } from "../utils/lambda-body-parser";
import { IController } from "../../application/contracts/controller";

export function lambdaHttpAdapter(controller: IController<unknown>) {
  return async (
    event: APIGatewayProxyEventV2,
  ): Promise<APIGatewayProxyResultV2> => {
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
  };
}
