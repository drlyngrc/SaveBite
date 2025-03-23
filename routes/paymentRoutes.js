import express from "express";
import {
  processPayments,
  getSalesHistory,
  getPurchaseHistory,
} from "../controllers/paymentController.js";
import UserService from "../services/UserService.js";

const router = express.Router();
const userService = new UserService();

router.get(
  "/history/sales",
  userService.checkAuth.bind(userService),
  getSalesHistory,
);

router.get(
  "/history/purchase",
  userService.checkAuth.bind(userService),
  getPurchaseHistory,
);

router.post(
  "/api/payment/process-payment",
  userService.checkAuth.bind(userService),
  processPayments,
);

export default router;
