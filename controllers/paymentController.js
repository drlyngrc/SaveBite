import PaymentService from "../services/PaymentService.js";
import { db } from "../config/firebase.js";
import {
  getDocs,
  collection,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";

const paymentService = new PaymentService();

export const processPayments = async (req, res) => {
  try {
    const userId = req.session.userId;
    const { orders } = req.body;

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized. Please log in to proceed." });
    }

    if (!orders || !Array.isArray(orders) || orders.length === 0) {
      return res
        .status(400)
        .json({ message: "No orders selected for confirmation." });
    }

    const { totalAmount, orderResults } = await paymentService.processOrders(
      userId,
      orders,
    );

    return res.status(200).json({
      message:
        "Order confirmed! Your items will be delivered via Cash on Delivery (COD).",
      totalAmount,
      orderResults,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error confirming order: " + error.message });
  }
};

export const getSalesHistory = async (req, res) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized. Please log in to view sales history.",
      });
    }

    const matchedOrders = await paymentService.getSalesHistory(userId);
    res.render("history/sales.ejs", { matchedOrders, currentRoute: '/history/sales' });
  } catch (error) {
    console.error("Error retrieving sales history:", error);
    res.status(500).send("Failed to load sales history.");
  }
};

export const getPurchaseHistory = async (req, res) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized. Please log in to view sales history.",
      });
    }

    const matchedOrders = await paymentService.getPurchaseHistory(userId);
    res.render("history/purchase.ejs", { matchedOrders, currentRoute: '/history/purchase' });
  } catch (error) {
    console.error("Error retrieving sales history:", error);
    res.status(500).send("Failed to load sales history.");
  }
};
