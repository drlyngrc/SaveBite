class Order {
    constructor(orderId, buyerId, productId, name, quantity, totalAmount) {
        this.orderId = orderId;
        this.buyerId = buyerId;
        this.productId = productId;
        this.name = name;
        this.quantity = quantity;
        this.totalAmount = totalAmount;
        this.orderStatus = "ordered";
    }
}

export default Order;