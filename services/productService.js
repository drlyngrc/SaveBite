import { db } from "../config/firebase.js";
import { collection, addDoc, setDoc, getDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import Product from "../models/Product.js";
import { v4 as uuidv4 } from 'uuid';

class ProductService {
    constructor() {
        this.productsCollection = collection(db, "products");
    }

    async addProduct(userId, name, description, category, quantity, price, expiryDate, image) {
        const productId = uuidv4();
        const newProduct = new Product(productId, userId, name, description, category, quantity, price, expiryDate, image);
        const productRef = doc(this.productsCollection, productId);
        await setDoc(productRef, { ...newProduct });

        return { id: productId, ...newProduct };
    }

    async getProductById(productId) {
        const productDoc = await getDoc(doc(db, "products", productId));
        return productDoc.exists() ? { id: productDoc.id, ...productDoc.data() } : null;
    }

    async getAllProducts() {
        const querySnapshot = await getDocs(this.productsCollection);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

/*     async updateProduct(productId, updatedData) {
        const productRef = doc(db, "products", productId);
        await updateDoc(productRef, updatedData);
        return { id: productId, ...updatedData };
    }
    
    async deleteProduct(productId) {
        await deleteDoc(doc(db, "products", productId));
        return { message: "Product deleted successfully", id: productId };
    } */
}

export default ProductService;