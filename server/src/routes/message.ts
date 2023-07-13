import express, { Request, Response } from "express";
import { Message, MessageAttrs } from "../models/message";
import { redisClient } from "../app";
import { body, check, param } from "express-validator";
import { validateRequest } from "../middlewares/validate-request";
import { Schema } from "mongoose";
import multer, { Multer } from "multer";
import { renameSync } from "fs";

declare namespace Express {
  export interface Request {
    file: Multer["single"];
  }
}

const router = express.Router();

router.post(
  "/send-message",
  [
    body("message").notEmpty().withMessage("You must provide a message"),
    body("sender").trim().notEmpty().withMessage("You must provide a sender"),
    body("receiver").trim().notEmpty().withMessage("You must provide a sender"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { message, sender, receiver } = req.body;

    const isUserOnline = await redisClient.sIsMember("onlineUsers", sender);
    const savedMessage = await Message.build({
      message,
      sender,
      receiver,
      type: "text",
      messageStatus: isUserOnline ? "delivered" : "sent",
    }).save();
    res.status(201).json(savedMessage);
  }
);

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

const uploadImages = multer({ dest: "uploads/images" });
router.post(
  "/send-image-message",

  uploadImages.single("image"),
  async (req: Request, res: Response) => {
    if (req.file) {
      const date = Date.now();
      let fileName = `uploads/images/` + date + req.file.originalname;
      renameSync(req.file.path, fileName);
      const { sender, receiver } = req.body;

      const isUserOnline = await redisClient.sIsMember("onlineUsers", sender);
      const savedMessage = await Message.build({
        message: fileName,
        sender,
        receiver,
        type: "image",
        messageStatus: isUserOnline ? "delivered" : "sent",
      }).save();
      res.status(201).json(savedMessage);
    }
  }
);

const uploadRecordings = multer({ dest: "uploads/recordings" });
router.post(
  "/send-audio-message",

  uploadRecordings.single("audio"),
  async (req: Request, res: Response) => {
    if (req.file) {
      const date = Date.now();
      let fileName = `uploads/recordings/` + date + req.file.originalname;
      renameSync(req.file.path, fileName);
      const { sender, receiver } = req.body;

      const isUserOnline = await redisClient.sIsMember("onlineUsers", sender);
      const savedMessage = await Message.build({
        message: fileName,
        sender,
        receiver,
        type: "audio",
        messageStatus: isUserOnline ? "delivered" : "sent",
      }).save();
      res.status(201).json(savedMessage);
    }
  }
);

export { router as messageRouter };
