import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
interface UserPayload {
  id: string;
  email: string;
  username: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY!);
    req.currentUser = decoded as UserPayload; // Store the decoded user ID in the request object for future use
  } catch (err) {}

  next();
};
