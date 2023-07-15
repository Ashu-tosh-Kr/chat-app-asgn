import express from "express";
import { currentUser } from "../middlewares/current-user";
import { User, UserAttrs } from "../models/user";
import { generateToken04 } from "../helpers/TokenGenerator";

const router = express.Router();

router.get("/api/users/all", async (req, res) => {
  const users = await User.find({}).sort({ username: "asc" });
  const userGrpByInitialLetter: {
    [key: string]: UserAttrs[];
  } = {};
  users.forEach((user) => {
    const initialLetter = user.username[0].toUpperCase();
    if (userGrpByInitialLetter[initialLetter]) {
      userGrpByInitialLetter[initialLetter].push(user);
    } else {
      userGrpByInitialLetter[initialLetter] = [user];
    }
  });
  res.send(userGrpByInitialLetter);
});

router.get("/api/users/currentuser", currentUser, async (req, res) => {
  res.send({ currentUser: req.currentUser || null });
});

router.get(
  "/api/users/generate-token/:userId",
  currentUser,
  async (req, res) => {
    const appId = parseInt(process.env.ZEGO_APP_ID!);
    const serverSecret = process.env.ZEGO_SERVER_SECRET!;
    const effectiveTime = 3600;
    const payload = "";

    if (appId && serverSecret) {
      // console.log(req.params.userId);

      const token = generateToken04(
        appId,
        req.params.userId,
        serverSecret,
        effectiveTime,
        payload
      );

      return res.send(token);
    }
    return res
      .status(400)
      .send([{ message: "App ID and server secret is required" }]);
  }
);
export { router as userRouter };
