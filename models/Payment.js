class Payment {
    constructor(paymentId, orderId, buyerId, paymentMethod, amount) {
        this.paymentId = paymentId;
        this.orderId = orderId;
        this.buyerId = buyerId;
        this.paymentMethod = paymentMethod;
        this.amount = amount;
        this.paymentStatus = "Completed";
        this.deliveryStatus = "Processing"
    }
}

export default Payment;