import { db } from "../config/firebase.js";
import ProductService from "./productService.js";
import Order from "../models/Order.js";
import { collection, doc, setDoc, getDocs, deleteDoc, query, where } from "firebase/firestore";
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

        if (parseInt(product.quantity, 10) < parseInt(quantity, 10)) {
            throw new Error("Not enough stock to fulfill the order");
        }

        const totalAmount = product.price * quantity;
        const orderData = new Order(orderId, userId, productId, product.name, quantity, totalAmount);
        orderData.orderDate = orderDate;
        orderData.status = "ordered";

        const orderRef = doc(this.ordersCollection, orderId);
        await setDoc(orderRef, { ...orderData });

        return { message: "Order placed successfully", order: orderData };
    }

    async getAllOrders() {
        const q = query(this.ordersCollection, where("status", "==", "ordered"));
        const querySnapshot = await getDocs(q);
    
        const ordersWithProducts = await Promise.all(
            querySnapshot.docs.map(async (doc) => {
                const orderData = { id: doc.id, ...doc.data() };
                const productDetails = await this.getProductById(orderData.productId);
                return { ...orderData, product: productDetails };
            })
        );
    
        return ordersWithProducts;
    }

    async cancelOrders(orderIds) {
        for (const orderId of orderIds) {
            const orderDocRef = doc(this.ordersCollection, orderId);
            await deleteDoc(orderDocRef);
        }
        return { message: "Selected orders have been deleted" };
    }

    async deleteOrder(orderId) {
        try {
            const orderRef = doc(this.ordersCollection, orderId);
            await deleteDoc(orderRef);
        } catch (error) {
            throw new Error("Failed to delete order.");
        }
    }
}

export default OrderService;