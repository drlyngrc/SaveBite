import express from "express";
import { processPayments } from "../controllers/paymentController.js";
import UserService from "../services/UserService.js";

const router = express.Router();
const userService = new UserService();

// router.get("/order/history", userService.checkAuth.bind(userService), getAllOrders);
router.post(
  "/api/payment/process-payment",
  userService.checkAuth.bind(userService),
  processPayments,
);

export default router;
