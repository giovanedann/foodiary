import { ErrorCode } from "../error-codes";
import { HttpError } from "./http-error";

export class BadRequestError extends HttpError {
  public override code: ErrorCode;
  public override statusCode: number = 400;

  constructor(message?: any, code?: ErrorCode) {
    super();

    this.name = "BadRequestError";
    this.message = message ?? "Bad Request";
    this.code = code ?? ErrorCode.BAD_REQUEST;
  }
}
