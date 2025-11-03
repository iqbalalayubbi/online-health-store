export class HttpError extends Error {
  public readonly statusCode: number;
  public readonly details?: unknown;

  constructor(statusCode: number, message: string, details?: unknown) {
    super(message);
    this.name = "HttpError";
    this.statusCode = statusCode;
    this.details = details;
  }
}

export const createHttpError = (statusCode: number, message: string, details?: unknown) => {
  return new HttpError(statusCode, message, details);
};
