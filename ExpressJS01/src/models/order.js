const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    image: { type: String, default: '' },
    quantity: { type: Number, required: true, min: 1 },
}, { _id: false });

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    items: [orderItemSchema],

    // Thông tin giao hàng
    shippingInfo: {
        fullName: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
        note: { type: String, default: '' },
    },

    // Phương thức thanh toán
    paymentMethod: {
        type: String,
        enum: ['COD'],
        default: 'COD',
        required: true,
    },

    totalAmount: { type: Number, required: true },
    shippingFee: { type: Number, default: 30000 },

    // Trạng thái đơn hàng
    status: {
        type: Number,
        default: 1,
        min: 1,
        max: 7,
    },

    // Lịch sử thay đổi trạng thái
    statusHistory: [
        {
            status: Number,
            changedAt: { type: Date, default: Date.now },
            note: { type: String, default: '' },
        }
    ],

    // Thời điểm đặt hàng (dùng để kiểm tra 30 phút hủy)
    placedAt: { type: Date, default: Date.now },

    // Cờ xác nhận tự động đã chạy chưa
    autoConfirmed: { type: Boolean, default: false },

}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
