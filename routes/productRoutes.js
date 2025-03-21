import express from "express";
import { addProduct, getProductById, getAllProducts } from "../controllers/productController.js";

const router = express.Router();

router.get("/product/:id", getProductById);
router.get("/product", getAllProducts);

router.get("/add-product", (req, res) => {
  res.render("product/add-product.ejs");
});

router.get("/product-listing", (req, res) => {
  res.render("product/product-listing.ejs");
});


router.post("/api/product/add-product", addProduct);

export default router;