import { db } from "../config/firebase.js";
import OrderService from "./OrderService.js";
import ProductService from "./productService.js";
import { v4 as uuidv4 } from "uuid";
import { collection, doc, setDoc, getDocs } from "firebase/firestore";

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

        let totalAmount = 0;
        let orderResults = [];

        for (const order of orders) {
            const product = await this.productService.getProductById(order.productId);
            if (!product || product.quantity < order.quantity) {
                throw new Error(`Insufficient stock for product: ${product ? product.name : "unknown"}`);
            }

            totalAmount += product.price * order.quantity;

            await this.updateProductStock(order.productId, product.quantity - order.quantity);
            await this.orderService.deleteOrder(order.orderId);

            orderResults.push({
                orderId: order.orderId,
                productId: order.productId,
                totalAmount: product.price * order.quantity,
            });
        }

        return { totalAmount, orderResults };
    }

    async updateProductStock(productId, newQuantity) {
        const updatedData = { quantity: newQuantity };
        const productRef = doc(db, "products", productId);
        await setDoc(productRef, updatedData, { merge: true });
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