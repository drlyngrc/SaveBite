import express from "express";
const router = express.Router();

router.get("/profile", (req, res) => {
  res.render("main/profile.ejs");
});

export default router;
