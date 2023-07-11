import express from "express";
import "express-async-errors";

import { errorHandler, NotFoundError } from "@ashu-org/common";
import { userRouter } from "./routes/user";
import { signInRouter } from "./routes/signin";
import { signOutRouter } from "./routes/signout";
import { signUpRouter } from "./routes/signup";
import cors from "cors";

const app = express();
app.set("trust proxy", true);
app.use(cors());
app.use(express.json());

app.use(userRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
