import ProductService from "../services/productService.js";

const productService = new ProductService();

export const addProduct = async (req, res) => {
    try {
        const { userId, name, category, quantity, price, expiryDate } = req.body;
        const product = await productService.addProduct(userId, name, quantity, category, price, expiryDate);
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productService.getProductById(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAllProducts = async (req, res) => {
    try {
        const products = await productService.getAllProducts();
        res.status(200).json(products);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};