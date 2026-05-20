const orderService = require('../services/orderService');

// Tạo đơn hàng
const createOrder = async (req, res) => {
    const userId = req.user._id;
    const { shippingInfo, paymentMethod = 'COD', note } = req.body;
    const data = await orderService.createOrderService(userId, shippingInfo, paymentMethod);
    return res.status(200).json(data);
};

// Lấy danh sách đơn hàng của user
const getMyOrders = async (req, res) => {
    const userId = req.user._id;
    const data = await orderService.getMyOrdersService(userId);
    return res.status(200).json(data);
};

// Lấy chi tiết 1 đơn hàng
const getOrderDetail = async (req, res) => {
    const userId = req.user._id;
    const { orderId } = req.params;
    const data = await orderService.getOrderDetailService(userId, orderId);
    return res.status(200).json(data);
};

// Hủy đơn hàng
const cancelOrder = async (req, res) => {
    const userId = req.user._id;
    const { orderId } = req.params;
    const { reason } = req.body;
    const data = await orderService.cancelOrderService(userId, orderId, reason);
    return res.status(200).json(data);
};

// Admin: Cập nhật trạng thái đơn hàng
const updateOrderStatus = async (req, res) => {
    const { orderId } = req.params;
    const { status, note } = req.body;
    const data = await orderService.updateOrderStatusService(orderId, status, note);
    return res.status(200).json(data);
};

module.exports = { createOrder, getMyOrders, getOrderDetail, cancelOrder, updateOrderStatus };
