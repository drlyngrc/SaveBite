import ProductService from "./productService.js"; // Import the base class
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

        const orderData = {
            orderId,
            userId,
            productId,
            productName: product.name,
            quantity,
            totalPrice: product.price * quantity,
            orderDate
        };

        const orderRef = doc(this.ordersCollection, orderId);
        await setDoc(orderRef, orderData);

        await this.updateProductStock(productId, product.quantity - quantity);

        return { message: "Order placed successfully", order: orderData };
    }

    async updateProductStock(productId, newQuantity) {
        const updatedData = { quantity: newQuantity };
        const productRef = doc(db, "products", productId);
        await setDoc(productRef, updatedData, { merge: true });
    }
}

export default OrderService;