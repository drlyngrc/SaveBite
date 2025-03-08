import express from 'express';
const router = express.Router();

router.get("/payment", (req, res) => {
    res.render("main/payment.ejs");
});

export default router;