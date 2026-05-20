import React, { useContext } from 'react';
import { Button, InputNumber, Empty, Spin, Divider, Tag, Popconfirm } from 'antd';
import {
    DeleteOutlined, ShoppingOutlined, ArrowRightOutlined,
    MinusOutlined, PlusOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../components/context/cart.context';
import { AuthContext } from '../components/context/auth.context';

const CartPage = () => {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const { cart, updateItem, removeItem, clearCart } = useContext(CartContext);

    if (!auth?.isAuthenticated) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
                <ShoppingOutlined style={{ fontSize: 64, color: '#d1d5db' }} />
                <p className="text-gray-500 text-lg">Vui lòng đăng nhập để xem giỏ hàng</p>
                <Button type="primary" danger onClick={() => navigate('/login')}>
                    Đăng nhập ngay
                </Button>
            </div>
        );
    }

    if (!cart) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Spin size="large" />
            </div>
        );
    }

    const items = cart.items || [];
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingFee = items.length > 0 ? 30000 : 0;
    const total = subtotal + shippingFee;

    return (
        <div className="min-h-screen bg-slate-50 py-8">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <ShoppingOutlined className="text-red-500" />
                        Giỏ hàng của bạn
                        {items.length > 0 && (
                            <Tag color="red" className="ml-2 text-sm font-normal">
                                {items.length} sản phẩm
                            </Tag>
                        )}
                    </h1>
                    {items.length > 0 && (
                        <Popconfirm
                            title="Xóa toàn bộ giỏ hàng?"
                            description="Bạn có chắc muốn xóa tất cả sản phẩm?"
                            onConfirm={clearCart}
                            okText="Xóa hết"
                            cancelText="Hủy"
                            okButtonProps={{ danger: true }}
                        >
                            <Button danger icon={<DeleteOutlined />}>
                                Xóa tất cả
                            </Button>
                        </Popconfirm>
                    )}
                </div>

                {items.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm p-16 text-center">
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={
                                <div>
                                    <p className="text-gray-500 text-base mb-2">Giỏ hàng của bạn đang trống</p>
                                    <p className="text-gray-400 text-sm">Hãy thêm sản phẩm vào giỏ hàng nhé!</p>
                                </div>
                            }
                        />
                        <Button
                            type="primary"
                            danger
                            size="large"
                            icon={<ShoppingOutlined />}
                            className="mt-4"
                            onClick={() => navigate('/')}
                        >
                            Tiếp tục mua sắm
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {items.map((item) => {
                                const discount = Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100);
                                return (
                                    <div
                                        key={item.productId}
                                        className="bg-white rounded-2xl shadow-sm p-5 flex gap-4 items-start transition-all hover:shadow-md"
                                    >
                                        {/* Image */}
                                        <div className="w-24 h-24 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                                            <img
                                                src={item.image || 'https://via.placeholder.com/96?text=No+Image'}
                                                alt={item.name}
                                                onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/96?text=No+Image')}
                                                className="w-full h-full object-contain"
                                            />
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-900 text-sm leading-5 line-clamp-2 mb-2">
                                                {item.name}
                                            </h3>
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className="text-red-600 font-bold text-base">
                                                    {item.price.toLocaleString('vi-VN')}đ
                                                </span>
                                                {discount > 0 && (
                                                    <>
                                                        <span className="text-gray-400 line-through text-xs">
                                                            {item.originalPrice.toLocaleString('vi-VN')}đ
                                                        </span>
                                                        <Tag color="red" className="text-xs">-{discount}%</Tag>
                                                    </>
                                                )}
                                            </div>

                                            {/* Quantity control */}
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    size="small"
                                                    icon={<MinusOutlined />}
                                                    onClick={() => updateItem(item.productId, item.quantity - 1)}
                                                    disabled={item.quantity <= 1}
                                                    className="rounded-lg"
                                                />
                                                <InputNumber
                                                    size="small"
                                                    value={item.quantity}
                                                    min={1}
                                                    max={99}
                                                    onChange={(val) => val && updateItem(item.productId, val)}
                                                    style={{ width: 60 }}
                                                    controls={false}
                                                    className="text-center [&_input]:text-center"
                                                />
                                                <Button
                                                    size="small"
                                                    icon={<PlusOutlined />}
                                                    onClick={() => updateItem(item.productId, item.quantity + 1)}
                                                    disabled={item.quantity >= 99}
                                                    className="rounded-lg"
                                                />
                                            </div>
                                        </div>

                                        {/* Subtotal + Remove */}
                                        <div className="flex flex-col items-end gap-2">
                                            <p className="font-bold text-gray-900 text-sm">
                                                {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                                            </p>
                                            <Popconfirm
                                                title="Xóa sản phẩm này?"
                                                onConfirm={() => removeItem(item.productId)}
                                                okText="Xóa"
                                                cancelText="Hủy"
                                                okButtonProps={{ danger: true }}
                                            >
                                                <Button
                                                    type="text"
                                                    danger
                                                    size="small"
                                                    icon={<DeleteOutlined />}
                                                />
                                            </Popconfirm>
                                        </div>
                                    </div>
                                );
                            })}

                            <Button
                                type="link"
                                icon={<ShoppingOutlined />}
                                onClick={() => navigate('/')}
                                className="text-gray-500 hover:text-red-500 pl-0"
                            >
                                ← Tiếp tục mua sắm
                            </Button>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-4">
                                <h2 className="text-lg font-bold text-gray-900 mb-4">Tóm tắt đơn hàng</h2>
                                <Divider className="my-3" />

                                <div className="space-y-3 mb-4">
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Tạm tính ({items.length} sản phẩm)</span>
                                        <span>{subtotal.toLocaleString('vi-VN')}đ</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Phí vận chuyển</span>
                                        <span className="text-green-600">
                                            {shippingFee > 0 ? `+${shippingFee.toLocaleString('vi-VN')}đ` : 'Miễn phí'}
                                        </span>
                                    </div>
                                </div>

                                <Divider className="my-3" />

                                <div className="flex justify-between font-bold text-gray-900 text-base mb-6">
                                    <span>Tổng cộng</span>
                                    <span className="text-red-600 text-lg">{total.toLocaleString('vi-VN')}đ</span>
                                </div>

                                <Button
                                    type="primary"
                                    danger
                                    block
                                    size="large"
                                    icon={<ArrowRightOutlined />}
                                    className="rounded-xl h-12 font-semibold text-base bg-gradient-to-r from-red-500 to-orange-500 border-none"
                                    onClick={() => navigate('/checkout')}
                                >
                                    Tiến hành thanh toán
                                </Button>

                                <div className="mt-4 p-3 bg-green-50 rounded-xl text-xs text-green-700 text-center">
                                    Giao hàng nhanh toàn quốc · Thanh toán an toàn
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;
