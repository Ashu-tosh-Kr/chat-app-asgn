import mongoose from "mongoose";
import { app } from "./app";
import { config } from "dotenv";

(async () => {
  config();
  if (!process.env.JWT_KEY) throw new Error("JWT_KEY must be defined");
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI must be defined");

  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch (err) {
    console.log(err);
  }
  console.log("Connected to MongoDB");

  app.listen(5000, () => {
    console.log("Listening on port 5000");
  });
})();
