class UserService {
    constructor() {
        this.productsCollection = collection(db, "users");
    }

    addFunds(amount) {
        if (amount > 0) {
            this.balance += amount;
            return `Added ₱${amount} to balance. Current Balance: ₱${this.balance}`;
        }
        return "Invalid amount.";
    }

    updateProfile(updateName, updateEmail, updatePassword, updateContact) {
        if (updateName) this.name = updateName;
        if (updateEmail) this.email = updateEmail;
        if (updatePassword) this.password = updatePassword;
        if (updateContact) this.contact = updateContact;
        return true;
    }
}

export default UserService;
