import express from "express";
import {
  displayProfile,
  updateProfile,
} from "../controllers/userController.js";
import UserService from "../services/UserService.js";
const router = express.Router();

const userService = new UserService();

router.get(
  "/profile",
  userService.checkAuth.bind(userService),
  async (req, res) => {
    return await displayProfile(req, res);
  },
);

router.post("/api/user/update-profile", updateProfile);

export default router;
