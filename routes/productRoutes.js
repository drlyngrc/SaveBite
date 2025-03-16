import express from "express";
const router = express.Router();

router.get("/foods", (req, res) => {
    try {
        console.log(req.session.userId);
        if(!req.session.userId) return res.send("Failed to login.");

        res.render("main/purchase.ejs");
    } catch (e) {
        res.send(e.message);
    }
});

export default router;