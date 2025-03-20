import express from "express";
import { addProduct, getProductById, getAllProducts } from "../controllers/productController.js";

const router = express.Router();

router.get("/foods/:id", getProductById);
router.get("/foods", getAllProducts);

router.post("/api/foods/add-product", addProduct);

export default router;