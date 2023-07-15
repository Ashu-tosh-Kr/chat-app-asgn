import express from "express";

const router = express.Router();

router.get("/api/signout", (req, res) => {
  req.cookies = null;
  res.send({});
});

export { router as signOutRouter };
