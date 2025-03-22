import express from "express";
import {
  addProduct,
  getProductById,
  getAllProducts,
} from "../controllers/productController.js";
import UserService from "../services/UserService.js";

const router = express.Router();
const userService = new UserService();

router.get(
  "/add-product",
  userService.checkAuth.bind(userService),
  (req, res) => {
    res.render("product/add-product.ejs");
  },
);

router.get(
  "/product-listing",
  userService.checkAuth.bind(userService),
  (req, res) => {
    res.render("product/product-listing.ejs");
  },
);

router.get("/product/:id", getProductById);
router.get("/product", getAllProducts);
router.get("/product/view/:id", getProductById);
router.post(
  "/api/product/add-product",
  userService.checkAuth.bind(userService),
  addProduct,
);

export default router;
