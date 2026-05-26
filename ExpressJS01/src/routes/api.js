const express = require('express');
const { createUser, handleLogin, getUser, getAccount, updateProfile } = require('../controllers/userController');
const { getProductsByCategory, getTopBestSellers, getTopMostViewed, incrementView } = require('../controllers/productController');
const { getCart, addToCart, updateCartItem, removeCartItem, clearCart } = require('../controllers/cartController');
const { createOrder, getMyOrders, getOrderDetail, cancelOrder, updateOrderStatus } = require('../controllers/orderController');
const auth = require('../middleware/auth');
const delay = require('../middleware/delay');

const routerAPI = express.Router();

routerAPI.use(auth);

routerAPI.get("/", (req, res) => {
    return res.status(200).json("Hello world api");
});

// Auth routes (whitelist trong middleware)
routerAPI.post("/register", createUser);
routerAPI.post("/login", handleLogin);

// User routes
routerAPI.get("/user", getUser);
routerAPI.get("/account", delay, getAccount);
routerAPI.put("/user/profile", updateProfile);

// Product routes
routerAPI.get("/products/best-sellers", getTopBestSellers);
routerAPI.get("/products/most-viewed", getTopMostViewed);
routerAPI.get("/products", getProductsByCategory);
routerAPI.patch("/products/:id/view", incrementView);

// ============ CART ROUTES ============
routerAPI.get("/cart", getCart);
routerAPI.post("/cart", addToCart);
routerAPI.patch("/cart/:productId", updateCartItem);
routerAPI.delete("/cart/:productId", removeCartItem);
routerAPI.delete("/cart", clearCart);

// ============ ORDER ROUTES ============
routerAPI.post("/orders", createOrder);
routerAPI.get("/orders", getMyOrders);
routerAPI.get("/orders/:orderId", getOrderDetail);
routerAPI.patch("/orders/:orderId/cancel", cancelOrder);
routerAPI.patch("/orders/:orderId/status", updateOrderStatus); // Admin

module.exports = routerAPI;