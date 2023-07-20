import mongoose from "mongoose";
import { config } from "dotenv";
config();
import { app } from "./app";
import { io, onConnection } from "./sockets";

(async () => {
  if (!process.env.JWT_KEY) throw new Error("JWT_KEY must be defined");
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI must be defined");

  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch (err) {
    console.log(err);
  }
  console.log("Connected to MongoDB");

  io.on("connection", onConnection);

  app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
  });
})();
