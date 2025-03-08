import express from 'express';
const router = express.Router();

router.get("/login", (req, res) => {
    res.render("auth/login.ejs");
});

router.get("/signup", (req, res) => {
    res.render("auth/signup.ejs");
});

export default router;