class Product {
    constructor(userId, productId, name, category, price, quantity, expiryDate) {
        this.foodId = foodId;
        this.name = name;
        this.category = category;
        this.price = price;
        this.quantity = quantity;
        this.expiryDate = expiryDate;
        this.createdAt = createdAt || new Date().toISOString(); 
    }
}

export default Product;