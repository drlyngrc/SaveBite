import express from 'express';
const router = express.Router();

router.get("/profile", (req, res) => {
    res.render("main/profile.ejs", { currentRoute: '/profile' });
});

export default router;