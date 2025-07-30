import { ErrorCode } from "@application/errors/error-codes";

import { ApplicationError } from "./application.error";

export class EmailAlreadyInUseError extends ApplicationError {
  public override code: ErrorCode;
  public override statusCode: number = 409; // Conflict

  constructor() {
    super();

    this.name = "EmailAlreadyInUseError";
    this.message = "Email already in use";
    this.code = ErrorCode.EMAIL_ALREADY_IN_USE;
  }
}
