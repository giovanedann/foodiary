import { ErrorCode } from "@application/errors/error-codes";

export abstract class ApplicationError extends Error {
  public abstract code: ErrorCode;
}
