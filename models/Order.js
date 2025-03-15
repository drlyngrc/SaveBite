class Order {
    constructor(orderId, buyerId, sellerId, totalAmount, orderStatus, foodItemsId = []) {
        this.orderId = orderId;
        this.buyerId = buyerId;
        this.sellerId = sellerId;
        this.totalAmount = totalAmount;
        this.orderStatus = orderStatus;
        this.foodItemsId = foodItemsId;
    }

    placeOrder() {
        this.orderStatus = "Placed";
        return true;
    }

    cancelOrder() {
        if (this.orderStatus !== "Delivered" && this.orderStatus !== "Completed") {
            this.orderStatus = "Cancelled";
            return true;
        }
        return false;
    }

    trackOrder() {
        return {
            orderId: this.orderId,
            status: this.orderStatus,
            buyerId: this.buyerId,
            sellerId: this.sellerId
        };
    }
}

export default Order;
