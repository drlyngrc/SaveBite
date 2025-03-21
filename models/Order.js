class Order {
    constructor(orderId, buyerId, sellerId, totalAmount, orderStatus, foodItemsId = []) {
        this.orderId = orderId;
        this.buyerId = buyerId;
        this.sellerId = sellerId;
        this.totalAmount = totalAmount;
        this.orderStatus = orderStatus;
        this.foodItemsId = foodItemsId;
    }
}

export default Order;
