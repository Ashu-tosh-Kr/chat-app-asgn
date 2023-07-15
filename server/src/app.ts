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
  socket.on("user-offline", (userId: string) => {
    redisClient.hDel("usersOnline", userId);
    socket.emit("is-user-online", { userId: false });
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

  socket.on("outgoing-voice-call", async (data) => {
    const sendUserSocket = await redisClient.hGet("usersOnline", data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("incoming-voice-call", {
        from: data.from,
        roomId: data.roomId,
        callType: data.callType,
      });
    }
  });

  socket.on("outgoing-video-call", async (data) => {
    const sendUserSocket = await redisClient.hGet("usersOnline", data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("incoming-video-call", {
        from: data.from,
        roomId: data.roomId,
        callType: data.callType,
      });
    }
  });
  socket.on("reject-voice-call", async (data) => {
    const sendUserSocket = await redisClient.hGet("usersOnline", data.from);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("voice-call-rejected");
    }
  });
  socket.on("reject-video-call", async (data) => {
    const sendUserSocket = await redisClient.hGet("usersOnline", data.from);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("video-call-rejected");
    }
  });
  socket.on("accept-incoming-call", async ({ id }) => {
    const sendUserSocket = await redisClient.hGet("usersOnline", id);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("accept-call");
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
//fetch audio
app.use(
  "/uploads/recordings",
  express.static(path.join(__dirname + "/../uploads/recordings/"))
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
