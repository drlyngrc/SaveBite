import { db } from "../config/firebase.js";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";

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

  async updateProfile(
    userId,
    updateName,
    updateEmail,
    updatePassword,
    updateContact,
  ) {
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

  async checkAuth(req, res, next) {
    try {
      if (!req.session.userId) {
        return res.redirect("/login");
      }

      const userId = req.session.userId;
      const userRef = doc(this.usersCollection, userId);
      const userSnapshot = await getDoc(userRef);

      if (!userSnapshot.exists()) {
        return res.redirect("/login");
      }

      next();
    } catch (error) {
      console.error("Authentication error:", error);
      res.status(500).send("Internal Server Error");
    }
  }
}

export default UserService;
