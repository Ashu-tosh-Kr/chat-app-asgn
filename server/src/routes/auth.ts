import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { body } from "express-validator";
import { Password } from "../helpers/password";
import { validateRequest } from "../middlewares/validate-request";
import { BadRequestError } from "../errors/bad-request-error";
import { User } from "../models/user";

const router = express.Router();

router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError("User with this email already exists");
    }
    const user = User.build({ username, email, password });
    await user.save();
    const userJwt = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
      },

      process.env.JWT_KEY!
    );

    res.status(201).json({
      email: user.email,
      id: user.id,
      username: user.username,
      access_token: userJwt,
    });
  }
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("You must provide a password"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      throw new BadRequestError("Invalid credentials");
    }

    const passwordMatch = await Password.compare(
      existingUser.password,
      password
    );

    if (!passwordMatch) {
      throw new BadRequestError("Invalid password", 401);
    }
    const userJwt = jwt.sign(
      {
        id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
      },
      process.env.JWT_KEY!
    );

    res.status(200).json({
      email: existingUser.email,
      id: existingUser._id,
      username: existingUser.username,
      access_token: userJwt,
    });
  }
);

export { router as authRouter };
