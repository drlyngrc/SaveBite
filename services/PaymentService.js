import OrderService from "./OrderService.js";
import ProductService from "./productService.js";

class PaymentService {
    constructor() {
        this.orderService = new OrderService();
        this.productService = new ProductService();
    }

    async processPayment(userId, productId, quantity, paymentDetails) {
        const product = await this.productService.getProductById(productId);
        if (!product || product.quantity < quantity) {
            throw new Error("Insufficient stock or product not found.");
        }
        const order = await this.orderService.addOrder(userId, productId, quantity, new Date());
        
        const paymentConfirmation = {
            orderId: order.order.orderId,
            userId,
            amount: order.order.totalPrice,
            paymentDetails,
            paymentDate: new Date(),
        };

        console.log("Payment processed successfully:", paymentConfirmation);

        return paymentConfirmation;
    }
}

export default PaymentService;