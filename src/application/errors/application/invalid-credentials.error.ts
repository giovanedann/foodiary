import { ErrorCode } from "@application/errors/error-codes";

import { ApplicationError } from "./application.error";

export class InvalidCredentialsError extends ApplicationError {
  public override code: ErrorCode;
  public override statusCode: number = 401; // Unauthorized

  constructor() {
    super();

    this.name = "InvalidCredentialsError";
    this.message = "Invalid credentials";
    this.code = ErrorCode.INVALID_CREDENTIALS;
  }
}
