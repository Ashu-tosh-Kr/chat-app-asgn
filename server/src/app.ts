import express from "express";
import "express-async-errors";
import * as redis from "redis";

import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";
import { userRouter } from "./routes/user";
import { signInRouter } from "./routes/signin";
import { signOutRouter } from "./routes/signout";
import { signUpRouter } from "./routes/signup";
import cors from "cors";
import { messageRouter } from "./routes/message";

const app = express();

export const redisClient = redis.createClient({
  url: "redis://localhost:6379",
});
(async () => {
  await redisClient.connect();
  console.log("Redis connected");
})();

app.set("trust proxy", true);
app.use(cors());
app.use(express.json());

app.use(userRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);
app.use("/api/messages", messageRouter);

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
