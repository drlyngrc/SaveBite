import express from "express";
import {
  processPayments,
  getSalesHistory,
  getPurchaseHistory,
  updatePurchaseHistoryStatus,
  updateSalesHistoryStatus,
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

router.post(
  "/api/payment/update-purchase",
  userService.checkAuth.bind(userService),
  updatePurchaseHistoryStatus,
);

router.post(
  "/api/payment/update-sales",
  userService.checkAuth.bind(userService),
  updateSalesHistoryStatus,
);

export default router;
