class Payment {
    constructor(paymentId, orderId, buyerId, paymentMethod, amount, paymentStatus) {
        this.paymentId = paymentId;
        this.orderId = orderId;
        this.buyerId = buyerId;
        this.paymentMethod = paymentMethod;
        this.amount = amount;
        this.paymentStatus = paymentStatus;
    }
}

export default Payment;
