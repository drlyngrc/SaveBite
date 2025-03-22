import OrderService from "./OrderService.js";
import ProductService from "./productService.js";
import Payment from "../models/Payment.js";
import { v4 as uuidv4 } from 'uuid';
import { doc, setDoc } from "firebase/firestore"; // Ensure Firestore import for updateProductStock

class PaymentService {
    constructor() {
        this.orderService = new OrderService();
        this.productService = new ProductService();
    }

    async processPayment(userId, productId, quantity, paymentDetails) {
        if (!paymentDetails || !paymentDetails.cardNumber || !paymentDetails.expiryDate) {
            throw new Error("Invalid payment details provided");
        }

        const product = await this.productService.getProductById(productId);
        if (!product || product.quantity < quantity) {
            throw new Error("Insufficient stock or product not found");
        }

        const totalPrice = product.price * quantity;

        const order = await this.orderService.addOrder(userId, productId, quantity, new Date());
        if (!order || !order.order || !order.order.orderId) {
            throw new Error("Failed to create order");
        }

        const paymentId = uuidv4();

        // Add checking if the user's balance is enough

        const paymentConfirmation = new Payment(
            paymentId,
            order.order.orderId,
            userId,
            paymentDetails.cardNumber,
            totalPrice,
            "confirmed"
        );

        await this.updateProductStock(productId, product.quantity - quantity);

        return paymentConfirmation;
    }

    async updateProductStock(productId, newQuantity) {
        const updatedData = { quantity: newQuantity };
        const productRef = doc(db, "products", productId);
        await setDoc(productRef, updatedData, { merge: true });
    }
}

export default PaymentService;