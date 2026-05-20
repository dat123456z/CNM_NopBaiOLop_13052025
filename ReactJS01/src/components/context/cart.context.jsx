import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuthContext } from './auth.context';
import axios from '../../util/axios.customize';
import { message } from 'antd';

export const CartContext = createContext({
    cart: null,
    cartCount: 0,
    fetchCart: () => {},
    addToCart: async () => {},
    updateItem: async () => {},
    removeItem: async () => {},
    clearCart: async () => {},
});

export const CartWrapper = ({ children }) => {
    const { auth } = useContext(AuthContext);
    const [cart, setCart] = useState(null);

    const cartCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

    const fetchCart = useCallback(async () => {
        if (!auth?.isAuthenticated) {
            setCart(null);
            return;
        }
        try {
            const res = await axios.get('/v1/api/cart');
            if (res?.EC === 0) setCart(res.cart);
        } catch (err) {
            console.error('Lỗi lấy giỏ hàng', err);
        }
    }, [auth?.isAuthenticated]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const addToCart = async (productId, quantity = 1) => {
        if (!auth?.isAuthenticated) {
            message.warning('Vui lòng đăng nhập để thêm vào giỏ hàng');
            return false;
        }
        try {
            const res = await axios.post('/v1/api/cart', { productId, quantity });
            if (res?.EC === 0) {
                setCart(res.cart);
                message.success('Đã thêm vào giỏ hàng!');
                return true;
            }
            message.error(res?.EM || 'Thêm vào giỏ thất bại');
            return false;
        } catch (err) {
            message.error('Lỗi kết nối');
            return false;
        }
    };

    const updateItem = async (productId, quantity) => {
        try {
            const res = await axios.patch(`/v1/api/cart/${productId}`, { quantity });
            if (res?.EC === 0) {
                setCart(res.cart);
                return true;
            }
            return false;
        } catch (err) {
            return false;
        }
    };

    const removeItem = async (productId) => {
        try {
            const res = await axios.delete(`/v1/api/cart/${productId}`);
            if (res?.EC === 0) {
                setCart(res.cart);
                message.success('Đã xóa sản phẩm khỏi giỏ hàng');
                return true;
            }
            return false;
        } catch (err) {
            return false;
        }
    };

    const clearCart = async () => {
        try {
            const res = await axios.delete('/v1/api/cart');
            if (res?.EC === 0) {
                setCart(res.cart);
                return true;
            }
            return false;
        } catch (err) {
            return false;
        }
    };

    return (
        <CartContext.Provider value={{ cart, cartCount, fetchCart, addToCart, updateItem, removeItem, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};
