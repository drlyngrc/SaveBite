import express from "express";
import { login, signup, logout } from "../controllers/authControllers.js"

const router = express.Router();

router.get("/login", (req, res) => {
    if(req.session.userId) return res.redirect("/add-product");

    res.render("auth/login.ejs");
});

router.get("/signup", (req, res) => {
    if(req.session.userId) return res.redirect("/add-product");

    res.render("auth/signup.ejs");
});

router.post("/api/login", login);
router.post("/api/signup", signup);

router.get("/api/logout", logout);
// router.post("/api/logout", logout);

export default router;