const Order = require('../models/order');
const Cart = require('../models/cart');

const ORDER_STATUS = {
    NEW: 1,
    CONFIRMED: 2,
    PREPARING: 3,
    SHIPPING: 4,
    DELIVERED: 5,
    CANCELLED: 6,
    CANCEL_REQUESTED: 7,
};

const STATUS_LABELS = {
    1: 'Đơn hàng mới',
    2: 'Đã xác nhận',
    3: 'Shop đang chuẩn bị hàng',
    4: 'Đang giao hàng',
    5: 'Đã giao thành công',
    6: 'Đã hủy',
    7: 'Yêu cầu hủy',
};

// Tạo đơn hàng mới từ giỏ hàng
const createOrderService = async (userId, shippingInfo, paymentMethod = 'COD') => {
    try {
        // Lấy giỏ hàng
        const cart = await Cart.findOne({ userId });
        if (!cart || cart.items.length === 0) {
            return { EC: 1, EM: 'Giỏ hàng trống' };
        }

        // Validate thông tin giao hàng
        if (!shippingInfo?.fullName || !shippingInfo?.phone || !shippingInfo?.address) {
            return { EC: 2, EM: 'Vui lòng điền đầy đủ thông tin giao hàng' };
        }

        const shippingFee = 30000;
        const totalAmount = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0) + shippingFee;

        const placedAt = new Date();

        const order = await Order.create({
            userId,
            items: cart.items.map(item => ({
                productId: item.productId,
                name: item.name,
                price: item.price,
                originalPrice: item.originalPrice,
                image: item.image,
                quantity: item.quantity,
            })),
            shippingInfo,
            paymentMethod,
            totalAmount,
            shippingFee,
            status: ORDER_STATUS.NEW,
            placedAt,
            statusHistory: [{ status: ORDER_STATUS.NEW, changedAt: placedAt, note: 'Đơn hàng được tạo' }],
        });

        // Xóa giỏ hàng sau khi tạo đơn
        cart.items = [];
        await cart.save();

        // Lên lịch tự động xác nhận sau 30 phút (nếu server còn chạy)
        setTimeout(async () => {
            try {
                const orderToConfirm = await Order.findById(order._id);
                if (orderToConfirm && orderToConfirm.status === ORDER_STATUS.NEW && !orderToConfirm.autoConfirmed) {
                    orderToConfirm.status = ORDER_STATUS.CONFIRMED;
                    orderToConfirm.autoConfirmed = true;
                    orderToConfirm.statusHistory.push({
                        status: ORDER_STATUS.CONFIRMED,
                        changedAt: new Date(),
                        note: 'Tự động xác nhận sau 30 phút',
                    });
                    await orderToConfirm.save();
                    console.log(`>>> Auto confirmed order: ${order._id}`);
                }
            } catch (err) {
                console.error('Auto confirm error:', err);
            }
        }, 30 * 60 * 1000); // 30 phút

        return { EC: 0, order };
    } catch (error) {
        console.error(error);
        return { EC: -1, EM: 'Lỗi khi tạo đơn hàng' };
    }
};

// Lấy danh sách đơn hàng của user
const getMyOrdersService = async (userId) => {
    try {
        const orders = await Order.find({ userId }).sort({ createdAt: -1 });
        const ordersWithLabel = orders.map(o => ({
            ...o.toObject(),
            statusLabel: STATUS_LABELS[o.status] || 'Không xác định',
        }));
        return { EC: 0, orders: ordersWithLabel };
    } catch (error) {
        console.error(error);
        return { EC: -1, EM: 'Lỗi khi lấy danh sách đơn hàng' };
    }
};

// Lấy chi tiết 1 đơn hàng
const getOrderDetailService = async (userId, orderId) => {
    try {
        const order = await Order.findOne({ _id: orderId, userId });
        if (!order) return { EC: 1, EM: 'Đơn hàng không tồn tại' };

        return {
            EC: 0,
            order: {
                ...order.toObject(),
                statusLabel: STATUS_LABELS[order.status] || 'Không xác định',
            }
        };
    } catch (error) {
        console.error(error);
        return { EC: -1, EM: 'Lỗi khi lấy chi tiết đơn hàng' };
    }
};

// Hủy đơn hàng
const cancelOrderService = async (userId, orderId, reason = '') => {
    try {
        const order = await Order.findOne({ _id: orderId, userId });
        if (!order) return { EC: 1, EM: 'Đơn hàng không tồn tại' };

        const now = new Date();
        const minutesSincePlaced = (now - new Date(order.placedAt)) / (1000 * 60);

        // Nếu đang ở trạng thái 3 trở lên (Shop chuẩn bị hàng), chỉ gửi yêu cầu hủy
        if (order.status >= ORDER_STATUS.PREPARING) {
            if (order.status >= ORDER_STATUS.DELIVERED) {
                return { EC: 3, EM: 'Không thể hủy đơn hàng đã giao hoặc đã hủy' };
            }
            // Gửi yêu cầu hủy
            order.status = ORDER_STATUS.CANCEL_REQUESTED;
            order.statusHistory.push({
                status: ORDER_STATUS.CANCEL_REQUESTED,
                changedAt: now,
                note: reason || 'Người dùng gửi yêu cầu hủy đơn',
            });
            await order.save();
            return { EC: 0, message: 'Đã gửi yêu cầu hủy đơn cho shop', order };
        }

        // Nếu trong 30 phút đầu (status 1 hoặc 2), cho phép hủy thẳng
        if (minutesSincePlaced <= 30) {
            order.status = ORDER_STATUS.CANCELLED;
            order.statusHistory.push({
                status: ORDER_STATUS.CANCELLED,
                changedAt: now,
                note: reason || 'Người dùng hủy đơn',
            });
            await order.save();
            return { EC: 0, message: 'Đơn hàng đã được hủy thành công', order };
        }

        return { EC: 2, EM: 'Chỉ có thể hủy đơn trong vòng 30 phút sau khi đặt hàng' };
    } catch (error) {
        console.error(error);
        return { EC: -1, EM: 'Lỗi khi hủy đơn hàng' };
    }
};

// Admin: cập nhật trạng thái
const updateOrderStatusService = async (orderId, newStatus, note = '') => {
    try {
        const order = await Order.findById(orderId);
        if (!order) return { EC: 1, EM: 'Đơn hàng không tồn tại' };

        if (![1, 2, 3, 4, 5, 6, 7].includes(Number(newStatus))) {
            return { EC: 2, EM: 'Trạng thái không hợp lệ' };
        }

        order.status = Number(newStatus);
        order.statusHistory.push({
            status: Number(newStatus),
            changedAt: new Date(),
            note,
        });
        await order.save();

        return {
            EC: 0,
            order: {
                ...order.toObject(),
                statusLabel: STATUS_LABELS[order.status],
            }
        };
    } catch (error) {
        console.error(error);
        return { EC: -1, EM: 'Lỗi khi cập nhật trạng thái đơn hàng' };
    }
};

module.exports = {
    createOrderService,
    getMyOrdersService,
    getOrderDetailService,
    cancelOrderService,
    updateOrderStatusService,
    ORDER_STATUS,
    STATUS_LABELS,
};
