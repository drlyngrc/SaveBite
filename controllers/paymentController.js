import { db } from "../config/firebase.js";
import { doc, getDoc, updateDoc, collection, addDoc } from "firebase/firestore";
import Payment from "../models/Payment.js";
import { v4 as uuidv4 } from 'uuid';

export const processCODPayment = async (req, res) => {
    try {
        const { orderId, buyerId, amount } = req.body;
        
        // Validate required fields
        if (!orderId || !buyerId || !amount) {
            return res.status(400).json({ 
                success: false, 
                error: "Missing required payment information" 
            });
        }

        // Check if order exists
        const orderRef = doc(db, "orders", orderId);
        const orderDoc = await getDoc(orderRef);
        
        if (!orderDoc.exists()) {
            return res.status(404).json({ 
                success: false, 
                error: "Order not found" 
            });
        }

        // Create a new payment record
        const paymentId = uuidv4();
        const payment = new Payment(
            paymentId,
            orderId,
            buyerId,
            "COD", // Payment method
            amount,
            "Pending" // Initial status for COD
        );

        // Process the payment
        const isProcessed = payment.processPayment();
        
        if (!isProcessed) {
            return res.status(400).json({ 
                success: false, 
                error: "Payment processing failed" 
            });
        }

        // Save payment to database
        const paymentsCollection = collection(db, "payments");
        await addDoc(paymentsCollection, {
            paymentId: payment.paymentId,
            orderId: payment.orderId,
            buyerId: payment.buyerId,
            paymentMethod: payment.paymentMethod,
            amount: payment.amount,
            paymentStatus: payment.paymentStatus,
            createdAt: new Date().toISOString()
        });

        // Update order status to reflect payment
        await updateDoc(orderRef, {
            orderStatus: "Awaiting Delivery",
            paymentId: payment.paymentId,
            paymentStatus: payment.paymentStatus,
            updatedAt: new Date().toISOString()
        });

        return res.status(200).json({
            success: true,
            message: "COD payment processed successfully",
            payment: {
                paymentId: payment.paymentId,
                orderId: payment.orderId,
                amount: payment.amount,
                paymentMethod: payment.paymentMethod,
                paymentStatus: payment.paymentStatus
            }
        });
    } catch (error) {
        console.error("Payment processing error:", error);
        return res.status(500).json({
            success: false,
            error: error.message || "An error occurred while processing payment"
        });
    }
};

export const getPaymentById = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Query payments collection
        const paymentsCollection = collection(db, "payments");
        const querySnapshot = await getDocs(paymentsCollection);
        
        // Find payment with matching ID
        const payment = querySnapshot.docs
            .map(doc => doc.data())
            .find(p => p.paymentId === id);
        
        if (!payment) {
            return res.status(404).json({ 
                success: false, 
                error: "Payment not found" 
            });
        }
        
        return res.status(200).json({
            success: true,
            payment
        });
    } catch (error) {
        console.error("Error fetching payment:", error);
        return res.status(500).json({
            success: false,
            error: error.message || "An error occurred while fetching payment"
        });
    }
};