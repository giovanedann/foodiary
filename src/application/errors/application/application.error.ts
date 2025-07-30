import { ErrorCode } from "@application/errors/error-codes";

export abstract class ApplicationError extends Error {
  public statusCode?: number;
  public abstract code: ErrorCode;
}
