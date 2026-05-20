const cartService = require('../services/cartService');

// Lấy giỏ hàng của user hiện tại
const getCart = async (req, res) => {
    const userId = req.user._id;
    const data = await cartService.getCartService(userId);
    return res.status(200).json(data);
};

// Thêm sản phẩm vào giỏ hàng
const addToCart = async (req, res) => {
    const userId = req.user._id;
    const { productId, quantity } = req.body;
    const data = await cartService.addToCartService(userId, productId, quantity);
    return res.status(200).json(data);
};

// Cập nhật số lượng sản phẩm trong giỏ
const updateCartItem = async (req, res) => {
    const userId = req.user._id;
    const { productId } = req.params;
    const { quantity } = req.body;
    const data = await cartService.updateCartItemService(userId, productId, quantity);
    return res.status(200).json(data);
};

// Xóa sản phẩm khỏi giỏ
const removeCartItem = async (req, res) => {
    const userId = req.user._id;
    const { productId } = req.params;
    const data = await cartService.removeCartItemService(userId, productId);
    return res.status(200).json(data);
};

// Xóa toàn bộ giỏ hàng
const clearCart = async (req, res) => {
    const userId = req.user._id;
    const data = await cartService.clearCartService(userId);
    return res.status(200).json(data);
};

module.exports = { getCart, addToCart, updateCartItem, removeCartItem, clearCart };
