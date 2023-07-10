import { CustomError } from "./custom-error";

export class BadRequestError extends CustomError {
  constructor(public message: string, public statusCode: number = 400) {
    super(message);

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
  serializeErrors() {
    return [{ message: this.message }];
  }
}
