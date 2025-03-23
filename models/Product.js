class Product {
  constructor(
    productId,
    userId,
    name,
    description,
    category,
    quantity,
    price,
    expiryDate,
    image,
  ) {
    this.productId = productId;
    this.userId = userId;
    this.name = name;
    this.description = description;
    this.category = category;
    this.quantity = quantity;
    this.price = price;
    this.expiryDate = expiryDate;
    this.image = image;
    this.createdAt = new Date().toISOString();
  }
}

export default Product;
