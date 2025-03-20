class Product {
    constructor(productId, userId, name, category, price, quantity, expiryDate) {
        this.productId = productId;
        this.userId = userId;
        this.name = name;
        this.category = category;
        this.quantity = quantity;
        this.price = price;
        this.expiryDate = expiryDate;
        this.createdAt = new Date().toISOString();
    }
}

export default Product;