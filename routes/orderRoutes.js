import express from 'express';
import { addOrder, deleteOrder, getAllOrders } from "../controllers/orderController.js";
import UserService from "../services/UserService.js";

const router = express.Router();
const userService = new UserService();

router.get("/order", userService.checkAuth.bind(userService), getAllOrders);
router.post("/api/order/add-order", userService.checkAuth.bind(userService), addOrder);
router.post("/api/order/delete-order", userService.checkAuth.bind(userService), deleteOrder);

export default router;