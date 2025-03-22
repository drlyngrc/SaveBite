import PaymentService from "../services/PaymentService.js";

const paymentService = new PaymentService();

export const processPayments = async (req, res) => {
    try {
        const userId = req.session.userId;
        const { orders } = req.body;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized. Please log in to proceed." });
        }

        if (!orders || orders.length === 0) {
            return res.status(400).json({ message: "No orders selected for confirmation." });
        }

        const { totalAmount, orderResults } = await paymentService.processOrders(userId, orders);

        res.status(200).json({
            message: "Order confirmed! Your items will be delivered via Cash on Delivery (COD).",
            totalAmount,
            orderResults,
        });
    } catch (error) {
        res.status(500).json({ message: "Error confirming order: " + error.message });
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