import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import db from "../config/firebase.js";

class UserService {
    constructor() {
        this.usersCollection = collection(db, "users");
    }

    async displayUserProfile(userId) {
        if (!userId) throw new Error("User ID is required.");

        const userRef = doc(this.usersCollection, userId);
        const userSnapshot = await getDoc(userRef);

        if (!userSnapshot.exists()) {
            throw new Error("User not found.");
        }

        return userSnapshot.data();
    }

    async addFunds(userId, amount) {
        if (!userId) throw new Error("User ID is required.");
        if (amount <= 0) throw new Error("Invalid amount.");

        const userRef = doc(this.usersCollection, userId);
        const userSnapshot = await getDoc(userRef);

        if (!userSnapshot.exists()) {
            throw new Error("User not found.");
        }

        const userData = userSnapshot.data();
        const newBalance = (userData.balance || 0) + amount; 

        await updateDoc(userRef, { balance: newBalance });

        return `Added ₱${amount} to balance. Current Balance: ₱${newBalance}`;
    }

    async updateProfile(userId, updateName, updateEmail, updatePassword, updateContact) {
        if (!userId) throw new Error("User ID is required.");

        const userRef = doc(this.usersCollection, userId);
        const updateData = {};

        if (updateName) updateData.name = updateName;
        if (updateEmail) updateData.email = updateEmail;
        if (updatePassword) updateData.password = updatePassword;
        if (updateContact) updateData.contact = updateContact;

        if (Object.keys(updateData).length === 0) {
            throw new Error("No profile information provided to update.");
        }

        await updateDoc(userRef, updateData);

        return "User profile updated successfully.";
    }
}

export default UserService;