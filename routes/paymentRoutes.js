import express from "express";
import { processPayments } from "../controllers/paymentController.js";
import UserService from "../services/UserService.js";

const router = express.Router();
const userService = new UserService();

router.get("/history/sales", userService.checkAuth.bind(userService), (req, res) => {
  res.render("history/sales.ejs", { currentRoute: "/history/sales" });
});

router.get("/history/purchase", userService.checkAuth.bind(userService), (req, res) => {
  res.render("history/purchase.ejs", { currentRoute: "/history/purchase" });
});

router.post(
  "/api/payment/process-payment",
  userService.checkAuth.bind(userService),
  processPayments,
);

export default router;
