import { RequestValidationError } from "../errors/request-validation-error";
import { validationResult } from "express-validator";
import { NextFunction, Request, Response } from "express";

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    throw new RequestValidationError(error.array());
  }
  next();
};
