import { Server, Socket } from "socket.io";
import { app, redisClient } from "../app";

export const io = new Server(app, {
  cors: {
    origin: "http://localhost:3000",
  },
});

export const onConnection = (socket: Socket) => {
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
};
