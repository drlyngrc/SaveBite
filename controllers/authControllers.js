import { auth, db } from "../config/firebase.js";
import { doc, setDoc, getDocs, collection } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import User from "../models/User.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password, contact, address } = req.body;

    if (!auth) {
      return res
        .status(500)
        .json({ error: "Firebase Auth is not initialized." });
    }

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;

    const userData = new User(user.uid, name, email, contact, address);

    await setDoc(doc(db, "users", user.uid), { ...userData });

    return res.status(201).json({
      message: "User created successfully",
    });
  } catch (e) {
    return res.status(400).json({
      success: false,
      error: e.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;

    req.session.userId = user.uid;
    // req.session.save((err)

    return res.status(200).json({ status: true });
  } catch (e) {
    if (
      e.code === "auth/wrong-password" ||
      e.code === "auth/user-not-found" ||
      e.code === "auth/invalid-credential"
    ) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      });
    }

    return res.status(400).json({
      success: false,
      error: e.message,
    });
  }
};

export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({ success: false, error: "Logout failed" });
    }
    res.redirect("/login");
  });
};
