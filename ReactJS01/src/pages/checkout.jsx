import React, { useContext, useState } from 'react';
import {
    Form, Input, Button, Divider, Radio, message, Steps, Result, Tag
} from 'antd';
import {
    EnvironmentOutlined, PhoneOutlined, UserOutlined,
    CreditCardOutlined, CheckCircleOutlined, ShoppingCartOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../components/context/cart.context';
import { AuthContext } from '../components/context/auth.context';
import axios from '../util/axios.customize';

const { TextArea } = Input;

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const { cart, fetchCart } = useContext(CartContext);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const [currentStep, setCurrentStep] = useState(0);

    if (!auth?.isAuthenticated) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
                <p className="text-gray-500 text-lg">Vui lòng đăng nhập để thanh toán</p>
                <Button type="primary" danger onClick={() => navigate('/login')}>Đăng nhập</Button>
            </div>
        );
    }

    const items = cart?.items || [];

    if (items.length === 0 && !orderId) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
                <ShoppingCartOutlined style={{ fontSize: 64, color: '#d1d5db' }} />
                <p className="text-gray-500 text-lg">Giỏ hàng trống, không thể thanh toán</p>
                <Button type="primary" danger onClick={() => navigate('/')}>Về trang chủ</Button>
            </div>
        );
    }

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingFee = 30000;
    const total = subtotal + shippingFee;

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const res = await axios.post('/v1/api/orders', {
                shippingInfo: {
                    fullName: values.fullName,
                    phone: values.phone,
                    address: values.address,
                    note: values.note || '',
                },
                paymentMethod: 'COD',
            });

            if (res?.EC === 0) {
                setOrderId(res.order._id);
                setCurrentStep(1);
                fetchCart(); // Refresh cart (sẽ empty sau khi đặt hàng)
                message.success('Đặt hàng thành công!');
            } else {
                message.error(res?.EM || 'Đặt hàng thất bại');
            }
        } catch (err) {
            message.error('Lỗi kết nối, vui lòng thử lại');
        } finally {
            setLoading(false);
        }
    };

    if (orderId && currentStep === 1) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12">
                <div className="bg-white rounded-2xl shadow-sm p-10 max-w-lg w-full text-center">
                    <Result
                        status="success"
                        icon={<CheckCircleOutlined style={{ color: '#22c55e', fontSize: 72 }} />}
                        title={<span className="text-2xl font-bold text-gray-900">Đặt hàng thành công!</span>}
                        subTitle={
                            <div className="space-y-2 mt-2">
                                <p className="text-gray-600">Mã đơn hàng: <span className="font-mono font-semibold text-gray-800">{orderId}</span></p>
                                <p className="text-gray-500 text-sm">Đơn hàng sẽ được xác nhận trong vòng 30 phút.</p>
                                <p className="text-gray-500 text-sm">Phương thức thanh toán: <Tag color="blue">COD - Thanh toán khi nhận hàng</Tag></p>
                            </div>
                        }
                        extra={[
                            <Button
                                key="orders"
                                type="primary"
                                danger
                                size="large"
                                className="rounded-xl"
                                onClick={() => navigate('/orders')}
                            >
                                Xem đơn hàng của tôi
                            </Button>,
                            <Button
                                key="home"
                                size="large"
                                className="rounded-xl"
                                onClick={() => navigate('/')}
                            >
                                Về trang chủ
                            </Button>,
                        ]}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-8">
            <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <CreditCardOutlined className="text-red-500" />
                    Thanh toán đơn hàng
                </h1>

                <Steps
                    current={currentStep}
                    className="mb-8"
                    items={[
                        { title: 'Thông tin giao hàng', icon: <EnvironmentOutlined /> },
                        { title: 'Hoàn tất', icon: <CheckCircleOutlined /> },
                    ]}
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
                            <h2 className="font-bold text-gray-900 text-base mb-4 flex items-center gap-2">
                                <EnvironmentOutlined className="text-red-500" />
                                Thông tin nhận hàng
                            </h2>
                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={handleSubmit}
                                initialValues={{ fullName: auth?.user?.name || '' }}
                            >
                                <Form.Item
                                    name="fullName"
                                    label="Họ và tên"
                                    rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                                >
                                    <Input
                                        prefix={<UserOutlined className="text-gray-400" />}
                                        placeholder="Nguyễn Văn A"
                                        size="large"
                                        className="rounded-xl"
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="phone"
                                    label="Số điện thoại"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập số điện thoại' },
                                        { pattern: /^[0-9]{9,11}$/, message: 'Số điện thoại không hợp lệ' },
                                    ]}
                                >
                                    <Input
                                        prefix={<PhoneOutlined className="text-gray-400" />}
                                        placeholder="0912345678"
                                        size="large"
                                        className="rounded-xl"
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="address"
                                    label="Địa chỉ giao hàng"
                                    rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                                >
                                    <Input
                                        prefix={<EnvironmentOutlined className="text-gray-400" />}
                                        placeholder="Số nhà, đường, phường, quận, tỉnh/thành phố"
                                        size="large"
                                        className="rounded-xl"
                                    />
                                </Form.Item>
                                <Form.Item name="note" label="Ghi chú (tùy chọn)">
                                    <TextArea
                                        rows={3}
                                        placeholder="Ghi chú cho shop (ví dụ: giao giờ hành chính, gọi trước khi giao...)"
                                        className="rounded-xl"
                                    />
                                </Form.Item>
                            </Form>
                        </div>

                        {/* Payment method */}
                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <h2 className="font-bold text-gray-900 text-base mb-4 flex items-center gap-2">
                                <CreditCardOutlined className="text-red-500" />
                                Phương thức thanh toán
                            </h2>
                            <Radio.Group value="COD" className="w-full">
                                <div className="border-2 border-red-500 rounded-xl p-4 bg-red-50">
                                    <Radio value="COD" className="w-full">
                                        <div className="ml-2">
                                            <p className="font-semibold text-gray-900">COD - Thanh toán khi nhận hàng</p>
                                            <p className="text-sm text-gray-500 mt-1">Bạn chỉ thanh toán khi nhận được hàng</p>
                                        </div>
                                    </Radio>
                                </div>
                                <div className="border border-gray-200 rounded-xl p-4 mt-3 opacity-50 cursor-not-allowed">
                                    <Radio value="BANK" disabled>
                                        <div className="ml-2">
                                            <p className="font-semibold text-gray-400">Chuyển khoản ngân hàng</p>
                                            <p className="text-sm text-gray-400">Sắp có</p>
                                        </div>
                                    </Radio>
                                </div>
                                <div className="border border-gray-200 rounded-xl p-4 mt-3 opacity-50 cursor-not-allowed">
                                    <Radio value="MOMO" disabled>
                                        <div className="ml-2">
                                            <p className="font-semibold text-gray-400">Ví điện tử MoMo</p>
                                            <p className="text-sm text-gray-400">Sắp có</p>
                                        </div>
                                    </Radio>
                                </div>
                            </Radio.Group>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-4">
                            <h2 className="text-base font-bold text-gray-900 mb-4">Đơn hàng của bạn</h2>

                            <div className="space-y-3 mb-4 max-h-72 overflow-y-auto pr-1">
                                {items.map((item) => (
                                    <div key={item.productId} className="flex gap-3 items-center">
                                        <div className="w-12 h-12 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                                            <img
                                                src={item.image || 'https://via.placeholder.com/48?text=No+Image'}
                                                alt={item.name}
                                                onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/48?text=No+Image')}
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-medium text-gray-800 line-clamp-2">{item.name}</p>
                                            <p className="text-xs text-gray-500">SL: {item.quantity}</p>
                                        </div>
                                        <p className="text-xs font-semibold text-red-600 flex-shrink-0">
                                            {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <Divider className="my-3" />

                            <div className="space-y-2 mb-4 text-sm">
                                <div className="flex justify-between text-gray-600">
                                    <span>Tạm tính</span>
                                    <span>{subtotal.toLocaleString('vi-VN')}đ</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Phí vận chuyển</span>
                                    <span>+{shippingFee.toLocaleString('vi-VN')}đ</span>
                                </div>
                            </div>

                            <Divider className="my-3" />

                            <div className="flex justify-between font-bold text-gray-900 mb-6">
                                <span>Tổng thanh toán</span>
                                <span className="text-red-600 text-lg">{total.toLocaleString('vi-VN')}đ</span>
                            </div>

                            <Button
                                type="primary"
                                danger
                                block
                                size="large"
                                loading={loading}
                                onClick={() => form.submit()}
                                className="rounded-xl h-12 font-semibold text-base bg-gradient-to-r from-red-500 to-orange-500 border-none"
                            >
                                {loading ? 'Đang xử lý...' : 'Đặt hàng ngay'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
