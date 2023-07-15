import express, { Request, Response } from "express";
import { Message, MessageAttrs } from "../models/message";
import { redisClient } from "../app";
import { body, check, param } from "express-validator";
import { validateRequest } from "../middlewares/validate-request";
import mongoose, { Schema } from "mongoose";
import multer, { Multer } from "multer";
import { renameSync } from "fs";
import { User } from "../models/user";
import { currentUser } from "../middlewares/current-user";
import { rateLimiter } from "../middlewares/rate-limiter";

declare namespace Express {
  export interface Request {
    file: Multer["single"];
  }
}

const router = express.Router();

router.get(
  "/get-messages/:sender/:receiver",
  [
    param("sender").trim().notEmpty().withMessage("You must provide a sender"),
    param("receiver")
      .trim()
      .notEmpty()
      .withMessage("You must provide a sender"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { sender, receiver } = req.params;

    // Get all messages between sender and receiver
    const messages = await Message.find({
      $or: [
        { sender: sender, receiver: receiver },
        { sender: receiver, receiver: sender },
      ],
    });

    // Mark all messages as seen
    const unreadMessages: (typeof Schema.Types.ObjectId)[] = [];
    messages.forEach((message, index) => {
      if (
        message.messageStatus !== "seen" &&
        message.sender.toString() === receiver
      ) {
        unreadMessages.push(message.id);
        messages[index].messageStatus = "seen";
      }
    });
    await Message.updateMany(
      { _id: { $in: unreadMessages } },
      { messageStatus: "seen" }
    );

    res.json({ messages: messages });
  }
);

router.post(
  "/send-message",
  rateLimiter({ secondsWindow: 60, allowedHits: 5 }),
  [
    body("message").notEmpty().withMessage("You must provide a message"),
    body("sender").trim().notEmpty().withMessage("You must provide a sender"),
    body("receiver").trim().notEmpty().withMessage("You must provide a sender"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { message, sender, receiver } = req.body;
    const isUserOnline = await redisClient.sIsMember("onlineUsers", sender);
    const savedMessage = Message.build({
      message,
      sender,
      receiver,
      type: "text",
      messageStatus: isUserOnline ? "delivered" : "sent",
    });
    await savedMessage.save();

    const senderUser = await User.findById(savedMessage.sender);
    const receiverUser = await User.findById(savedMessage.receiver);
    if (senderUser && receiverUser) {
      senderUser.sentMessages?.push(savedMessage);
      receiverUser.receivedMessages?.push(savedMessage);
      await senderUser.save();
      await receiverUser.save();
    }

    res.status(201).json(savedMessage);
  }
);

const uploadImages = multer({ dest: "uploads/images" });
router.post(
  "/send-image-message",
  rateLimiter({ secondsWindow: 60, allowedHits: 5 }),
  uploadImages.single("image"),
  async (req: Request, res: Response) => {
    if (req.file) {
      const date = Date.now();
      let fileName = `uploads/images/` + date + req.file.originalname;
      renameSync(req.file.path, fileName);
      const { sender, receiver } = req.body;

      const isUserOnline = await redisClient.sIsMember("onlineUsers", sender);
      const savedMessage = Message.build({
        message: fileName,
        sender,
        receiver,
        type: "image",
        messageStatus: isUserOnline ? "delivered" : "sent",
      });
      await savedMessage.save();

      const senderUser = await User.findById(savedMessage.sender);
      const receiverUser = await User.findById(savedMessage.receiver);
      if (senderUser && receiverUser) {
        senderUser.sentMessages?.push(savedMessage);
        receiverUser.receivedMessages?.push(savedMessage);
        await senderUser.save();
        await receiverUser.save();
      }

      res.status(201).json(savedMessage);
    }
  }
);

const uploadRecordings = multer({ dest: "uploads/recordings" });
router.post(
  "/send-audio-message",
  rateLimiter({ secondsWindow: 60, allowedHits: 5 }),
  uploadRecordings.single("audio"),
  async (req: Request, res: Response) => {
    if (req.file) {
      const date = Date.now();
      let fileName = `uploads/recordings/` + date + req.file.originalname;
      renameSync(req.file.path, fileName);
      const { sender, receiver } = req.body;

      const isUserOnline = await redisClient.sIsMember("onlineUsers", sender);
      const savedMessage = Message.build({
        message: fileName,
        sender,
        receiver,
        type: "audio",
        messageStatus: isUserOnline ? "delivered" : "sent",
      });
      await savedMessage.save();

      const senderUser = await User.findById(savedMessage.sender);
      const receiverUser = await User.findById(savedMessage.receiver);
      if (senderUser && receiverUser) {
        senderUser.sentMessages?.push(savedMessage);
        receiverUser.receivedMessages?.push(savedMessage);
        await senderUser.save();
        await receiverUser.save();
      }

      res.status(201).json(savedMessage);
    }
  }
);

router.get(
  "/get-initial-contacts/:userId",
  currentUser,
  async (req: Request, res: Response) => {
    const user = await User.findById(req.params.userId).select({
      sentMessages: 1,
      receivedMessages: 1,
    });
    if (user && user.sentMessages && user.receivedMessages) {
      const messages = [...user.sentMessages, ...user.receivedMessages];
      messages.sort((a, b) => {
        return a.createdAt?.getTime()! - b.createdAt?.getTime()!;
      });
      const chatHistoryMap = new Map();

      // Extract unique user IDs from the messages
      const userIds = [
        ...new Set(
          messages.flatMap((message) => [
            message.sender.toString(),
            message.receiver.toString(),
          ])
        ),
      ];

      try {
        // Fetch usernames for the user IDs
        const users = await User.find({ _id: { $in: userIds } });

        // Create a mapping of user IDs to usernames
        const userIdToUsername = new Map(
          users.map((user) => [user._id.toString(), user])
        );

        const messageStatusSent: string[] = [];
        // Iterate through each message
        messages.forEach((message) => {
          if (message.messageStatus === "sent") {
            messageStatusSent.push(message.id!);
          }

          const senderId = message.sender.toString();
          const receiverId = message.receiver.toString();

          // Fetch the corresponding usernames and update the message objects
          const senderUser = userIdToUsername.get(senderId);
          const receiverUser = userIdToUsername.get(receiverId);

          // Add the sender and receiver usernames to the map if they don't exist
          if (senderId !== user.id && !chatHistoryMap.has(senderId)) {
            chatHistoryMap.set(senderId, {
              messages: [],
              unreadCount: 0,
              user: senderUser,
            });
          }
          if (receiverId !== user.id && !chatHistoryMap.has(receiverId)) {
            chatHistoryMap.set(receiverId, {
              messages: [],
              unreadCount: 0,
              user: receiverUser,
            });
          }

          // Check if the message is unread and increment the unread count
          if (receiverId === user.id && message.messageStatus === "sent") {
            const receiverEntry = chatHistoryMap.get(receiverId);
            if (receiverEntry) {
              receiverEntry.unreadCount++;
            }
          }

          // Add the message to the respective sender and receiver entries in the map
          chatHistoryMap.get(senderId)?.messages.push(message);
          chatHistoryMap.get(receiverId)?.messages.push(message);
        });

        // Sort the messages in each entry of the map by createdAt timestamp (latest to oldest)
        chatHistoryMap.forEach((entry) => {
          entry.messages.sort((a: any, b: any) => b.createdAt - a.createdAt);
        });

        if (messageStatusSent.length > 0) {
          await Message.updateMany(
            { _id: { $in: messageStatusSent } },
            { messageStatus: "delivered" }
          );
        }

        return res.json(Array.from(chatHistoryMap));
      } catch (error) {
        console.error("Error fetching usernames:", error);
        res
          .status(500)
          .json({ error: "An error occurred while fetching usernames." });
      }
    }
    res.json([]);
  }
);

export { router as messageRouter };
