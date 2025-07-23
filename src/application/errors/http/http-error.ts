import { ErrorCode } from "@application/errors/error-codes";

export abstract class HttpError extends Error {
  public abstract statusCode: number;
  public abstract code: ErrorCode;
}
