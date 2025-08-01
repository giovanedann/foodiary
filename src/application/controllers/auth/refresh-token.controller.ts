import { Injectable } from "@kernel/decorators/injectable";
import { Schema } from "@kernel/decorators/schema";

import { Controller } from "@application/contracts/controller";
import {
  RefreshTokenBody,
  refreshTokenSchema,
} from "@application/controllers/auth/schemas/refresh-token.schema";
import { RefreshTokenUseCase } from "@application/use-cases/auth/refresh-token.usecase";

@Injectable()
@Schema(refreshTokenSchema)
export class RefreshTokenController extends Controller<
  "public",
  RefreshTokenController.Response
> {
  constructor(private readonly refreshTokenUseCase: RefreshTokenUseCase) {
    super();
  }

  protected override async handle({
    body,
  }: Controller.Request<"public", RefreshTokenBody>): Promise<
    Controller.Response<RefreshTokenController.Response>
  > {
    const { refreshToken } = body;

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      await this.refreshTokenUseCase.execute({
        refreshToken: refreshToken,
      });

    return {
      statusCode: 200,
      body: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
    };
  }
}

export namespace RefreshTokenController {
  export type Response = {
    accessToken: string;
    refreshToken: string;
  };
}
