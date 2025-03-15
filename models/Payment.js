class Payment {
    constructor(paymentId, orderId, buyerId, paymentMethod, amount, paymentStatus) {
        this.paymentId = paymentId;
        this.orderId = orderId;
        this.buyerId = buyerId;
        this.paymentMethod = paymentMethod;
        this.amount = amount;
        this.paymentStatus = paymentStatus;
    }

    processPayment() {
        if (this.validatePaymentDetails()) {
            this.paymentStatus = "Completed";
            return true;
        }
        this.paymentStatus = "Failed";
        return false;
    }

    validatePaymentDetails() {
        return this.amount > 0 && this.paymentMethod && this.orderId;
    }
}

export default Payment;
