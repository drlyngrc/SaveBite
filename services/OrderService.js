import ProductService from "./productService.js";
import Order from "../models/Order.js";
import { collection, doc, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';

class OrderService extends ProductService {
    constructor() {
        super();
        this.ordersCollection = collection(db, "orders");
    }

    async addOrder(userId, productId, quantity, orderDate) {
        const orderId = uuidv4();

        const product = await this.getProductById(productId);
        if (!product) {
            throw new Error("Product not found");
        }

        if (product.quantity < quantity) {
            throw new Error("Not enough stock to fulfill the order");
        }

        const totalAmount = product.price * quantity;

        const orderData = new Order(orderId, userId, productId, product.name, quantity, totalAmount);
        orderData.orderDate = orderDate;

        const orderRef = doc(this.ordersCollection, orderId);
        await setDoc(orderRef, orderData);

        return { message: "Order placed successfully", order: orderData };
    }

    async cancelOrders() {
        // Cancel single or multiple orders
        // Delete the order request permanently
    }

    async getAllOrders() {
        // Display all orders with status = 'ordered'
    }
}

export default OrderService;