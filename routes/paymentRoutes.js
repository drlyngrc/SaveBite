import express from 'express';
import { processCODPayment, getPaymentById } from "../controllers/paymentController.js";

const router = express.Router();

router.get("/payment", (req, res) => {
    res.render("main/payment.ejs");
});

// API endpoints
router.post("/api/payment/cod", processCODPayment);
router.get("/api/payment/:id", getPaymentById);

export default router;