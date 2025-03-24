import { db } from "../config/firebase.js";
import OrderService from "./OrderService.js";
import ProductService from "./productService.js";
import Payment from "../models/Payment.js";
import { v4 as uuidv4 } from "uuid";
import {
  collection,
  doc,
  writeBatch,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

class PaymentService {
  constructor() {
    this.orderService = new OrderService();
    this.productService = new ProductService();
    this.paymentCollection = collection(db, "payments");
  }

  async processOrders(userId, orders) {
    if (!orders || !Array.isArray(orders) || orders.length === 0) {
      throw new Error("No orders selected for confirmation.");
    }

    const paymentId = uuidv4();
    const paymentDocRef = doc(this.paymentCollection, paymentId);

    let totalAmount = 0;
    let orderResults = [];
    const batch = writeBatch(db);

    try {
      for (const order of orders) {
        const productRef = doc(db, "products", order.productId);
        const productSnap = await getDoc(productRef);

        if (!productSnap.exists()) {
          throw new Error(`Product not found: ${order.productId}`);
        }

        const product = productSnap.data();

        if (!product.quantity || product.quantity < order.quantity) {
          throw new Error(`Insufficient stock for product: ${product.name}`);
        }

        const orderAmount = product.price * order.quantity;
        totalAmount += orderAmount;

        batch.set(
          productRef,
          { quantity: product.quantity - order.quantity },
          { merge: true },
        );

        const orderRef = doc(db, "orders", order.orderId);
        const orderSnap = await getDoc(orderRef);

        if (orderSnap.exists()) {
          batch.delete(orderRef);
        }

        const orderDetails = {
          productId: order.productId,
          quantity: order.quantity,
          amount: orderAmount,
          productName: product.name,
          productCategory: product.category,
          paymentStatus: "Pending",
          deliveryStatus: "Pending",
        };

        const orderDocRef = doc(
          db,
          `payments/${paymentId}/orders`,
          order.orderId,
        );
        batch.set(orderDocRef, orderDetails);

        orderResults.push({
          orderId: order.orderId,
          productId: order.productId,
          totalAmount: orderAmount,
        });
      }

      const paymentData = new Payment(
        paymentId,
        null,
        userId,
        totalAmount,
        new Date().toISOString(),
        orders.length,
      );

      batch.set(paymentDocRef, { ...paymentData });

      await batch.commit();
    } catch (error) {
      console.error("Error processing orders:", error);
      throw new Error("Transaction failed: " + error.message);
    }

    return { paymentId, totalAmount, orderResults };
  }

  async getHistory(userId, isSales = false) {
    try {
      const snapshot = await getDocs(this.paymentCollection);
      const matchedOrders = [];

      for (const paymentDoc of snapshot.docs) {
        const paymentData = paymentDoc.data();
        const ordersRef = collection(paymentDoc.ref, "orders");
        const ordersSnapshot = await getDocs(ordersRef);

        for (const orderDoc of ordersSnapshot.docs) {
          const orderData = orderDoc.data();

          if (isSales) {
            const productRef = doc(db, "products", orderData.productId);
            const productSnap = await getDoc(productRef);

            if (!productSnap.exists()) {
              console.warn(
                `Product not found for productId: ${orderData.productId}`,
              );
              continue;
            }

            const productData = productSnap.data();

            if (productData.userId === userId) {
              matchedOrders.push({
                paymentId: paymentDoc.id,
                orderId: orderDoc.id,
                createdAt: paymentData.createdAt,
                ...orderData,
              });
            }
          } else {
            if (paymentData.buyerId === userId) {
              matchedOrders.push({
                paymentId: paymentDoc.id,
                createdAt: paymentData.createdAt,
                orderId: orderDoc.id,
                ...orderData,
              });
            }
          }
        }
      }

      return matchedOrders;
    } catch (error) {
      console.error("Error fetching history:", error);
      throw new Error("Failed to fetch history.");
    }
  }

  async getSalesHistory(userId) {
    return this.getHistory(userId, true);
  }

  async getPurchaseHistory(userId) {
    return this.getHistory(userId, false);
  }

  async updateOrderStatus(paymentId, orderId, statusField, statusValue) {
    if (!paymentId || !orderId) {
      throw new Error("Invalid paymentId or orderId.");
    }

    try {
      const orderRef = doc(db, `payments/${paymentId}/orders`, orderId);
      const orderSnap = await getDoc(orderRef);

      if (!orderSnap.exists()) {
        throw new Error(
          `Order not found: paymentId=${paymentId}, orderId=${orderId}`,
        );
      }

      await updateDoc(orderRef, { [statusField]: statusValue });

      return { orderId, status: statusValue };
    } catch (error) {
      console.error(`Error updating ${statusField}:`, error.message);
      throw new Error(`Failed to update ${statusField}: ${error.message}`);
    }
  }

  async updateSalesHistory(paymentId, orderId) {
    return this.updateOrderStatus(paymentId, orderId, "paymentStatus", "Paid");
  }

  async updatePurchaseHistoryStatus(paymentId, orderId) {
    return this.updateOrderStatus(
      paymentId,
      orderId,
      "deliveryStatus",
      "Received",
    );
  }
}

export default PaymentService;
