import { ErrorCode } from "../error-codes";

export abstract class HttpError extends Error {
  public abstract statusCode: number;
  public abstract code: ErrorCode;
}
