const express = require('express');
const { createUser, handleLogin, getUser,
    getAccount
} = require('../controllers/userController');
const { getProductsByCategory, getTopBestSellers, getTopMostViewed, incrementView } = require('../controllers/productController');
const auth = require('../middleware/auth');
const delay = require('../middleware/delay');

const routerAPI = express.Router();

routerAPI.use(auth);

routerAPI.get("/", (req, res) => {
    return res.status(200).json("Hello world api")
})

routerAPI.post("/register", createUser);
routerAPI.post("/login", handleLogin);

routerAPI.get("/user", getUser);
routerAPI.get("/account", delay, getAccount);

// Product routes
routerAPI.get("/products/best-sellers", getTopBestSellers);
routerAPI.get("/products/most-viewed", getTopMostViewed);
routerAPI.get("/products", getProductsByCategory);
routerAPI.patch("/products/:id/view", incrementView);

module.exports = routerAPI; 