class User {
    constructor(userId, name, email, password) {
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.password = password;
    }
}

class Seller extends User{
   constructor(userId, name, email, password) {
        super(userId, name, email, password);
        this.foodItems = [];
    }

    listFoodItem(foodItem) {
      
    }

    updateFoodItem(foodItem) {
      
    }

    removeFoodItem(foodItem) {
      
    }
}

class Buyer extends User{
    constructor(userId, name, email, password) {
          super(userId, name, email, password);
      }

    browseFoodItem() {
      
    }

    placeOrder(order) {
      
    }

    makePayment(payment) {
      
    }
}

