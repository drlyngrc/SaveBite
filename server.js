import express from "express";
import path from "path";
import session from "express-session";
import { fileURLToPath } from "url";
import auth from "./routes/authRoutes.js";
import user from "./routes/userRoutes.js";
import product from "./routes/productRoutes.js";
import orders from "./routes/orderRoutes.js";
import payment from "./routes/paymentRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(
  session({
    secret: process.env.SECRET_SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use("/static", express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.use("/", auth, user, product, orders, payment);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Listening to ${PORT}...`);
});
