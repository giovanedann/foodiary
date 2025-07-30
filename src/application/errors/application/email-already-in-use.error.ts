import { ErrorCode } from "@application/errors/error-codes";

import { ApplicationError } from "./application.error";

export class EmailAlreadyInUseError extends ApplicationError {
  public override code: ErrorCode;

  constructor(message?: any, code?: ErrorCode) {
    super();

    this.name = "EmailAlreadyInUseError";
    this.message = message ?? "Email already in use";
    this.code = code ?? ErrorCode.EMAIL_ALREADY_IN_USE;
  }
}
