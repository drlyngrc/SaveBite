class FoodItem {
    constructor(foodId, name, category, price, quantity, expiryDate, sellerId) {
        this.foodId = foodId;
        this.name = name;
        this.category = category;
        this.price = price;
        this.quantity = quantity;
        this.expiryDate = expiryDate;
        this.sellerId = sellerId;
    }

    updateStock(quantity) {
        if (quantity >= 0) {
            this.quantity = quantity;
            return true;
        }``
        return false;
    }

    isExpired() {
        const currentDate = new Date();
        return currentDate > this.expiryDate;
    }
}

export default FoodItem;
