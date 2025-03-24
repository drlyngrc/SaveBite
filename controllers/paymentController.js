import PaymentService from "../services/PaymentService.js";

const paymentService = new PaymentService();

export const processPayments = async (req, res) => {
  try {
    const userId = req.session.userId;
    const { orders } = req.body;

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized. Please log in to proceed." });
    }

    if (!orders || !Array.isArray(orders) || orders.length === 0) {
      return res
        .status(400)
        .json({ message: "No orders selected for confirmation." });
    }

    const { totalAmount, orderResults } = await paymentService.processOrders(
      userId,
      orders,
    );

    return res.status(200).json({
      message:
        "Order confirmed! Your items will be delivered via Cash on Delivery (COD).",
      totalAmount,
      orderResults,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error confirming order: " + error.message });
  }
};

const getHistory = async (req, res, isSales) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized. Please log in to view your history.",
      });
    }

    const matchedOrders = isSales
      ? await paymentService.getSalesHistory(userId)
      : await paymentService.getPurchaseHistory(userId);

    const viewPath = isSales ? "history/sales.ejs" : "history/purchase.ejs";
    const currentRoute = isSales ? "/history/sales" : "/history/purchase";

    res.render(viewPath, { matchedOrders, currentRoute });
  } catch (error) {
    console.error(
      `Error retrieving ${isSales ? "sales" : "purchase"} history:`,
      error,
    );
    res
      .status(500)
      .send(`Failed to load ${isSales ? "sales" : "purchase"} history.`);
  }
};

export const getSalesHistory = (req, res) => getHistory(req, res, true);
export const getPurchaseHistory = (req, res) => getHistory(req, res, false);

const updateHistoryStatus = async (req, res, updateFunction) => {
  try {
    const { paymentId, orderId } = req.body;
    if (!paymentId || !orderId) {
      return res.status(400).json({
        success: false,
        message: "Both paymentId and orderId are required.",
      });
    }

    const result = await updateFunction(paymentId, orderId);
    return res.status(200).json({
      success: true,
      message: `Order ${result.orderId} marked as ${result.status}.`,
    });
  } catch (error) {
    console.error("Error updating history status:", error.message);
    return res.status(500).json({
      success: false,
      message: `Error updating history status: ${error.message}`,
    });
  }
};

export const updateSalesHistoryStatus = (req, res) =>
  updateHistoryStatus(
    req,
    res,
    paymentService.updateSalesHistory.bind(paymentService),
  );
export const updatePurchaseHistoryStatus = (req, res) =>
  updateHistoryStatus(
    req,
    res,
    paymentService.updatePurchaseHistoryStatus.bind(paymentService),
  );
