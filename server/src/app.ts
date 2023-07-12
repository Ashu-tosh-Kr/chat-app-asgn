import express from "express";
import "express-async-errors";
import * as redis from "redis";
import http from "http";
import path from "path";

import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";
import { userRouter } from "./routes/user";
import { signInRouter } from "./routes/signin";
import { signOutRouter } from "./routes/signout";
import { signUpRouter } from "./routes/signup";
import cors from "cors";
import { messageRouter } from "./routes/message";
import { Server } from "socket.io";

const app = express();

//socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  socket.on("user-online", (userId: string) => {
    redisClient.hSet("usersOnline", userId, socket.id);
  });

  socket.on("message-sent", async (message) => {
    const sendUserSocket = await redisClient.hGet(
      "usersOnline",
      message.receiver
    );
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("message-received", {
        ...message,
        createdAt: new Date().toISOString(),
      });
    }
  });
});

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

app.use(userRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);
app.use("/api/messages", messageRouter);

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { server as app };
