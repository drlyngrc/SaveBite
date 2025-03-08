import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import auth from "./routes/authRoutes.js";
import orders from "./routes/orderRoutes.js";
import payment from "./routes/paymentRoutes.js";
import product from "./routes/productRoutes.js";
import user from "./routes/userRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use("/static", express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("landing.ejs");
});

app.use("/", auth, orders, product, payment, user);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Listening to ${PORT}...`);
});