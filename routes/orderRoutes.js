import express from 'express';
const router = express.Router();

router.get("/order", (req, res) => {
    res.render("main/order.ejs");
});

export default router;