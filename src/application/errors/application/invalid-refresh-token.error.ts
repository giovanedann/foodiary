import { ErrorCode } from "@application/errors/error-codes";

import { ApplicationError } from "./application.error";

export class InvalidRefreshTokenError extends ApplicationError {
  public override code: ErrorCode;
  public override statusCode: number = 401; // Unauthorized

  constructor() {
    super();

    this.name = "InvalidRefreshTokenError";
    this.message = "Invalid refresh token";
    this.code = ErrorCode.INVALID_REFRESH_TOKEN;
  }
}
