import ProductService from "../services/productService.js";

const productService = new ProductService();

export const addProduct = async (req, res) => {
    try {
        const { name, description, category, quantity, price, expiry, image } = req.body;
        const userId = req.session.userId;
        console.log(userId);
        const product = await productService.addProduct(userId, name, description, category, quantity, price, expiry, image);
        
        if (!userId) {
            return res.status(400).json({ error: "User ID is missing from the session" });
        }

        res.status(201).json({
            product,
            message: "Succesfully added the item"
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productService.getProductById(id);
        const currentUserId = req.session.userId;

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.render("product/view-product.ejs", { product });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAllProducts = async (req, res) => {
    try {
        const products = await productService.getAllProducts();
        const currentUserId = req.session.userId;

        res.render("product/product-listing.ejs", { products, currentUserId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};