import express from 'express';
const router = express.Router();

router.get("/purchase", (req, res) => {
    res.render("main/purchase.ejs");
});

router.get("/sell", (req, res) => {
    res.render("main/sell.ejs");
});

export default router;