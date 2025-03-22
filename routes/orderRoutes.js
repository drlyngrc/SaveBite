import express from 'express';
import { addOrder } from "../controllers/orderController.js"

const router = express.Router();

router.get("/order", (req, res) => {
    res.render("order/order.ejs");
});

router.post("/api/product/add-order", addOrder);

export default router;