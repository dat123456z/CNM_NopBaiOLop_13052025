import axios from './axios.customize';

const createUserApi = (name, email, password) => {
    return axios.post("/v1/api/register", { name, email, password });
}

const loginApi = (email, password) => {
    return axios.post("/v1/api/login", { email, password });
}

const getUserApi = () => {
    return axios.get("/v1/api/user");
}

const updateProfileApi = (name, phone, address) => {
    return axios.put("/v1/api/user/profile", { name, phone, address });
}

const getProductsByCategoryApi = (category = 'all', page = 1, limit = 8) => {
    return axios.get(`/v1/api/products?category=${category}&page=${page}&limit=${limit}`);
}

const getBestSellersApi = (limit = 10) => {
    return axios.get(`/v1/api/products/best-sellers?limit=${limit}`);
}

const getMostViewedApi = (limit = 10) => {
    return axios.get(`/v1/api/products/most-viewed?limit=${limit}`);
}

const incrementViewApi = (id) => {
    return axios.patch(`/v1/api/products/${id}/view`);
}

// ===== Cart APIs =====
const getCartApi = () => axios.get('/v1/api/cart');
const addToCartApi = (productId, quantity = 1) => axios.post('/v1/api/cart', { productId, quantity });
const updateCartItemApi = (productId, quantity) => axios.patch(`/v1/api/cart/${productId}`, { quantity });
const removeCartItemApi = (productId) => axios.delete(`/v1/api/cart/${productId}`);
const clearCartApi = () => axios.delete('/v1/api/cart');

// ===== Order APIs =====
const createOrderApi = (shippingInfo, paymentMethod = 'COD') =>
    axios.post('/v1/api/orders', { shippingInfo, paymentMethod });
const getMyOrdersApi = () => axios.get('/v1/api/orders');
const getOrderDetailApi = (orderId) => axios.get(`/v1/api/orders/${orderId}`);
const cancelOrderApi = (orderId, reason) => axios.patch(`/v1/api/orders/${orderId}/cancel`, { reason });
const updateOrderStatusApi = (orderId, status, note) => axios.patch(`/v1/api/orders/${orderId}/status`, { status, note });

export {
    createUserApi, loginApi, getUserApi, updateProfileApi,
    getProductsByCategoryApi, getBestSellersApi, getMostViewedApi, incrementViewApi,
    getCartApi, addToCartApi, updateCartItemApi, removeCartItemApi, clearCartApi,
    createOrderApi, getMyOrdersApi, getOrderDetailApi, cancelOrderApi, updateOrderStatusApi,
};
