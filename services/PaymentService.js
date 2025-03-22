import { db } from "../config/firebase.js";
import OrderService from "./OrderService.js";
import ProductService from "./productService.js";
import Payment from "../models/Payment.js";
import { v4 as uuidv4 } from "uuid";
import { collection, doc, setDoc, writeBatch, getDoc, getDocs } from "firebase/firestore";

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
            console.log("Processing orders for user:", userId);

            for (const order of orders) {
                console.log("Processing order:", order);

                const productRef = doc(db, "products", order.productId);
                const productSnap = await getDoc(productRef);

                if (!productSnap.exists()) {
                    throw new Error(`Product not found: ${order.productId}`);
                }

                const product = productSnap.data();
                console.log("Fetched product data:", product);

                if (!product.quantity || product.quantity < order.quantity) {
                    throw new Error(`Insufficient stock for product: ${product.name}`);
                }

                const orderAmount = product.price * order.quantity;
                totalAmount += orderAmount;

                batch.set(productRef, { quantity: product.quantity - order.quantity }, { merge: true });

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
                };

                const orderDocRef = doc(db, `payments/${paymentId}/orders`, order.orderId);
                batch.set(orderDocRef, orderDetails);

                orderResults.push({ orderId: order.orderId, productId: order.productId, totalAmount: orderAmount });
            }

            const paymentData = new Payment(
                paymentId,
                null,
                userId,
                totalAmount,
                new Date().toISOString(),
                orders.length
            );
            
            batch.set(paymentDocRef, { ...paymentData });

            await batch.commit();
            console.log("Firestore transaction committed successfully.");

        } catch (error) {
            console.error("Error processing orders:", error);
            throw new Error("Transaction failed: " + error.message);
        }

        return { paymentId, totalAmount, orderResults };
    }

    async getAllPayments() {
        const snapshot = await getDocs(this.paymentCollection);
        const payments = [];

        snapshot.forEach((doc) => {
            payments.push({ id: doc.id, ...doc.data() });
        });

        return payments;
    }
}

export default PaymentService;