import { CustomError } from "./custom-error";

export class RateLimitExceededError extends CustomError {
  statusCode = 429;

  constructor() {
    super("Not authorized");

    Object.setPrototypeOf(this, RateLimitExceededError.prototype);
  }

  serializeErrors() {
    return [{ message: "Rate Limit Exceeded" }];
  }
}
