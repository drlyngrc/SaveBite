class Payment {
  constructor(paymentId, orderId, buyerId, totalAmount, createdAt, orderCount) {
    this.paymentId = paymentId;
    this.orderId = orderId;
    this.buyerId = buyerId;
    this.paymentStatus = "Completed";
    this.deliveryStatus = "Processing";
    this.totalAmount = totalAmount;
    this.createdAt = createdAt;
    this.orderCount = orderCount;
  }
}

export default Payment;
