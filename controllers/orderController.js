import OrderService from "../services/OrderService.js";

const orderService = new OrderService();

export const addOrder = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        
        const userId = req.session.userId;

        if (!userId) {
            return res.status(400).json({ error: "User ID is missing from the session" });
        }

        const orderDate = new Date().toISOString();
        const order = await orderService.addOrder(userId, productId, quantity, orderDate);

        res.status(201).json({
            order,
            message: "Order placed successfully",
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAllOrders = async (req, res) => {
    const userId = req.session.userId;

    try {
        const orders = await orderService.getAllOrders();
        res.render("order/order.ejs", { orders, userId, currentRoute: '/order' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const cancelOrders = async (req, res) => {
    try {
        const { orderIds } = req.body;

        if (!Array.isArray(orderIds) || orderIds.length === 0) {
            return res.status(400).json({ error: "No orders selected for cancellation" });
        }

        const result = await orderService.cancelOrders(orderIds);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteOrder = async (req, res) => {
    try {
        const { orderId } = req.body;

        if (!orderId) {
            return res.status(400).json({ error: "Order ID is missing" });
        }

        await orderService.deleteOrder(orderId);
        res.status(200).json({ message: `Order with ID ${orderId} has been deleted.` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};