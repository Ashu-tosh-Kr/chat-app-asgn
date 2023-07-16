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
import { Server } from "socket.io";
import { currentUser } from "./middlewares/current-user";
import { requireAuth } from "./middlewares/require-auth";
import { authRouter } from "./routes/auth";

const app = express();

//socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  socket.on("user-online", async (userId: string) => {
    await redisClient.hSet("usersOnline", userId, socket.id);
    const onlineUsers = await redisClient.hGetAll("usersOnline");
    io.emit("is-user-online", Object.keys(onlineUsers));
  });

  socket.on("user-offline", async (userId: string) => {
    await redisClient.hDel("usersOnline", userId);
    const onlineUsers = await redisClient.hGetAll("usersOnline");
    io.emit("is-user-online", Object.keys(onlineUsers));
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

  //rooms logic
  socket.on("join-everybody", async () => {
    socket.join("everybody");
    const stringifiedMessages = await redisClient.lRange("messages", 0, -1);
    const messages = stringifiedMessages.map((msg) => JSON.parse(msg));
    socket.emit("everybody-msg-history", messages);
  });
  socket.on("everybody-msg-send", async (msg) => {
    const rateLimitKey = `rate-limit:${socket.id}`;

    const requests = await redisClient.incr(rateLimitKey);

    if (requests === 1) {
      await redisClient.expire(rateLimitKey, 60);
    }

    if (requests > 5) {
      socket.emit("everybody-msg-received", {
        ...msg,
        message: "Don't Spam! 😡",
        sender: "****",
        senderName: "BOT",
      });
    } else {
      redisClient.rPush("messages", JSON.stringify(msg));
      const messages = await redisClient.lRange("messages", 0, -1);

      // Keep only the latest 50 messages
      if (messages.length > 50) {
        await redisClient.lTrim("messages", -50, -1);
      }
      io.to("everybody").emit("everybody-msg-received", msg);
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

app.use("/api/auth", authRouter);
app.use("/api/users", currentUser, requireAuth, userRouter);
app.use("/api/messages", currentUser, requireAuth, messageRouter);

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { server as app };
