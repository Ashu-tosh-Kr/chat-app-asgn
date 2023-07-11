import express from "express";
import { currentUser } from "@ashu-org/common";
import { User, UserAttrs } from "../models/user";

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

export { router as userRouter };
