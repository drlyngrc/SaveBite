import express from "express";
import { displayProfile } from "../controllers/userController.js";
import UserService from "../services/UserService.js";
const router = express.Router();

const userService = new UserService();

router.get("/profile",  userService.checkAuth.bind(userService), async (req, res) => {
    return await displayProfile(req, res);
});

export default router;
