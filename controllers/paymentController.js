import PaymentService from "../services/PaymentService.js";

const paymentService = new PaymentService();

export const processPayments = async (req, res) => {
    try {
        const userId = req.session.userId; 
        const { orders, paymentDetails } = req.body;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized. Please log in to proceed with payment." });
        }

        if (!orders || orders.length === 0) {
            return res.status(400).json({ message: "No orders selected for payment." });
        }

        if (!paymentDetails || !paymentDetails.cardNumber || !paymentDetails.expiryDate) {
            return res.status(400).json({ message: "Payment details are incomplete or missing." });
        }

        const { totalAmount, paymentResults } = await paymentService.processPayments(userId, orders, paymentDetails);

        res.status(200).json({
            message: "Payment processed successfully.",
            totalAmount,
            paymentResults,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllPayments = async (req, res) => {
    try {
        const payments = await paymentService.getAllPayments();
        res.status(200).json({
            message: "Payments retrieved successfully.",
            payments,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};