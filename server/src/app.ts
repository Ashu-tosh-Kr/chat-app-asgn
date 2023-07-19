import express from "express";
import "express-async-errors";
import * as redis from "redis";
import http from "http";
import path from "path";

import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";
import { userRouter } from "./routes/user";
import cors from "cors";
import { messageRouter } from "./routes/message";
import { currentUser } from "./middlewares/current-user";
import { requireAuth } from "./middlewares/require-auth";
import { authRouter } from "./routes/auth";

const app = express();

//socket.io
const server = http.createServer(app);

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
app.use(express.urlencoded({ extended: true }));

//fetch images
app.use(
  "/uploads/images",
  express.static(path.join(__dirname + "/../uploads/images/"))
);
//fetch audio
app.use(
  "/uploads/recordings",
  express.static(path.join(__dirname + "/../uploads/recordings/"))
);

app.use("/api/auth", authRouter);
app.use("/api/users", currentUser, requireAuth, userRouter);
app.use("/api/messages", currentUser, requireAuth, messageRouter);

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { server as app };
