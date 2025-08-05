import { ErrorCode } from "@application/errors/error-codes";

import { ApplicationError } from "./application.error";

export class ResourceNotFoundError extends ApplicationError {
  public override code: ErrorCode;
  public override statusCode: number = 404; // Not Found

  constructor(message?: string) {
    super();

    this.name = "ResourceNotFoundError";
    this.message = message ?? "Resource not found";
    this.code = ErrorCode.RESOURCE_NOT_FOUND;
  }
}
