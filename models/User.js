import Order from './Order.js';

class User {
    constructor(userId, name, email, password, contact) {
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.password = password;
        this.contact = contact;
        this.balance = 0;
    }

    updateProfile(updateName, updateEmail, updatePassword, updateContact) {
        if (updateName) this.name = updateName;
        if (updateEmail) this.email = updateEmail;
        if (updatePassword) this.password = updatePassword;
        if (updateContact) this.contact = updateContact;
        return true;
        //return `Profile updated for user: ${this.userId}`;
    }

    //add funds
    addFunds(amount) {
        if (amount > 0) {
            this.balance += amount;
            return `Added ₱${amount} to balance. Current Balance: ₱${this.balance}`;
        }
        return "Invalid amount.";
    }
}

class Customer extends User { 
    constructor(userId, name, email, password, contact) {
        super(userId, name, email, password, contact);
        this.ordersList = [];
    }
    
    placeOrder(orderId, sellerId, totalAmount, foodItemsId = []) {
        const newOrder = new Order(orderId, this.userId, sellerId, totalAmount, "Placed", foodItemsId);
        this.ordersList.push(newOrder);
        return "Order placed successfully!";
    }

    viewOrder(){
        if (this.ordersList.length === 0) {
            return "No order found.";
        }
        return this.ordersList.map(order => order.trackOrder());
    }
}

class Admin extends User {
    constructor(userId, name, email, password) {
        super(userId, name, email, password);
        this.userList = [];
    }

    viewAllUsers() {
        return this.userList;
    }

    deleteUser(userId) {
        const index = this.userList.findIndex(user => user.userId === userId);
        if (index !== -1) {
            this.userList.splice(index, 1);
            return `User ID ${userId} deleted successfully.`;
        }
        return `User ID ${userId} not found.`;
    }

}

export {User, Customer, Admin};