import OrderService from "./OrderService.js";
import ProductService from "./productService.js";
import Payment from "../models/Payment.js";
import { v4 as uuidv4 } from "uuid";
import { doc, setDoc } from "firebase/firestore";

class PaymentService {
    constructor() {
        this.orderService = new OrderService();
        this.productService = new ProductService();
    }

    async processPayments(userId, orders, paymentDetails) {
        if (!orders || !Array.isArray(orders) || orders.length === 0) {
            throw new Error("No orders selected for payment");
        }

        if (!paymentDetails || !paymentDetails.cardNumber || !paymentDetails.expiryDate) {
            throw new Error("Invalid payment details provided");
        }

        let totalAmount = 0;
        let paymentResults = [];

        for (const order of orders) {
            const product = await this.productService.getProductById(order.productId);
            if (!product || product.quantity < order.quantity) {
                throw new Error(`Insufficient stock for product: ${product ? product.name : "unknown"}`);
            }

            totalAmount += product.price * order.quantity;

            const placedOrder = await this.orderService.addOrder(userId, order.productId, order.quantity, new Date());
            
            const paymentId = uuidv4();
            const paymentConfirmation = new Payment(
                paymentId,
                placedOrder.order.orderId,
                userId,
                paymentDetails.cardNumber,
                product.price * order.quantity,
                "confirmed"
            );

            await this.updateProductStock(order.productId, product.quantity - order.quantity);
            await this.orderService.deleteOrder(placedOrder.order.orderId);

            paymentResults.push(paymentConfirmation);
        }

        return { totalAmount, paymentResults };
    }

    async updateProductStock(productId, newQuantity) {
        const updatedData = { quantity: newQuantity };
        const productRef = doc(db, "products", productId);
        await setDoc(productRef, updatedData, { merge: true });
    }
}

export default PaymentService;