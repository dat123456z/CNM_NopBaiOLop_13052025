const Cart = require('../models/cart');
const Product = require('../models/product');

// Lấy giỏ hàng
const getCartService = async (userId) => {
    try {
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = await Cart.create({ userId, items: [] });
        }
        return { EC: 0, cart };
    } catch (error) {
        console.error(error);
        return { EC: -1, EM: 'Lỗi khi lấy giỏ hàng' };
    }
};

// Thêm vào giỏ hàng
const addToCartService = async (userId, productId, quantity = 1) => {
    try {
        const product = await Product.findById(productId);
        if (!product) return { EC: 1, EM: 'Sản phẩm không tồn tại' };

        let cart = await Cart.findOne({ userId });
        if (!cart) cart = await Cart.create({ userId, items: [] });

        const existingItem = cart.items.find(item => item.productId.toString() === productId.toString());

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({
                productId: product._id,
                name: product.name,
                price: product.price,
                originalPrice: product.originalPrice,
                image: product.image,
                quantity,
            });
        }

        await cart.save();
        return { EC: 0, cart };
    } catch (error) {
        console.error(error);
        return { EC: -1, EM: 'Lỗi khi thêm vào giỏ hàng' };
    }
};

// Cập nhật số lượng
const updateCartItemService = async (userId, productId, quantity) => {
    try {
        const cart = await Cart.findOne({ userId });
        if (!cart) return { EC: 1, EM: 'Giỏ hàng không tồn tại' };

        const item = cart.items.find(i => i.productId.toString() === productId.toString());
        if (!item) return { EC: 2, EM: 'Sản phẩm không có trong giỏ' };

        if (quantity <= 0) {
            cart.items = cart.items.filter(i => i.productId.toString() !== productId.toString());
        } else {
            item.quantity = quantity;
        }

        await cart.save();
        return { EC: 0, cart };
    } catch (error) {
        console.error(error);
        return { EC: -1, EM: 'Lỗi khi cập nhật giỏ hàng' };
    }
};

// Xóa 1 sản phẩm
const removeCartItemService = async (userId, productId) => {
    try {
        const cart = await Cart.findOne({ userId });
        if (!cart) return { EC: 1, EM: 'Giỏ hàng không tồn tại' };

        cart.items = cart.items.filter(i => i.productId.toString() !== productId.toString());
        await cart.save();
        return { EC: 0, cart };
    } catch (error) {
        console.error(error);
        return { EC: -1, EM: 'Lỗi khi xóa sản phẩm khỏi giỏ hàng' };
    }
};

// Xóa toàn bộ giỏ hàng
const clearCartService = async (userId) => {
    try {
        const cart = await Cart.findOne({ userId });
        if (!cart) return { EC: 0, message: 'Giỏ hàng đã trống' };

        cart.items = [];
        await cart.save();
        return { EC: 0, cart };
    } catch (error) {
        console.error(error);
        return { EC: -1, EM: 'Lỗi khi xóa giỏ hàng' };
    }
};

module.exports = { getCartService, addToCartService, updateCartItemService, removeCartItemService, clearCartService };
