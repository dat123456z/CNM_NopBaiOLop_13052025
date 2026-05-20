import React, { useContext, useEffect, useState } from 'react';
import {
    Tag, Button, Spin, Timeline, Divider, Steps, message, Modal
} from 'antd';
import {
    ArrowLeftOutlined, EnvironmentOutlined, PhoneOutlined,
    UserOutlined, ClockCircleOutlined, CheckCircleOutlined,
    CarOutlined, GiftOutlined, CloseCircleOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../components/context/auth.context';
import axios from '../util/axios.customize';

const STATUS_CONFIG = {
    1: { label: 'Đơn hàng mới', color: 'blue', icon: <ClockCircleOutlined />, stepIndex: 0 },
    2: { label: 'Đã xác nhận', color: 'cyan', icon: <CheckCircleOutlined />, stepIndex: 1 },
    3: { label: 'Đang chuẩn bị hàng', color: 'orange', icon: <GiftOutlined />, stepIndex: 2 },
    4: { label: 'Đang giao hàng', color: 'purple', icon: <CarOutlined />, stepIndex: 3 },
    5: { label: 'Đã giao thành công', color: 'green', icon: <CheckCircleOutlined />, stepIndex: 4 },
    6: { label: 'Đã hủy', color: 'red', icon: <CloseCircleOutlined />, stepIndex: -1 },
    7: { label: 'Yêu cầu hủy', color: 'volcano', icon: <CloseCircleOutlined />, stepIndex: -1 },
};

const STEPS = [
    { title: 'Đơn mới', icon: <ClockCircleOutlined /> },
    { title: 'Xác nhận', icon: <CheckCircleOutlined /> },
    { title: 'Chuẩn bị', icon: <GiftOutlined /> },
    { title: 'Giao hàng', icon: <CarOutlined /> },
    { title: 'Thành công', icon: <CheckCircleOutlined /> },
];

const OrderDetailPage = () => {
    const { orderId } = useParams();
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [showCancelModal, setShowCancelModal] = useState(false);

    const fetchOrder = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`/v1/api/orders/${orderId}`);
            if (res?.EC === 0) setOrder(res.order);
            else message.error(res?.EM || 'Không tìm thấy đơn hàng');
        } catch {
            message.error('Lỗi kết nối');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (auth?.isAuthenticated) fetchOrder();
    }, [auth?.isAuthenticated, orderId]);

    if (!auth?.isAuthenticated) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
                <p className="text-gray-500">Vui lòng đăng nhập</p>
                <Button type="primary" danger onClick={() => navigate('/login')}>Đăng nhập</Button>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Spin size="large" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
                <p className="text-gray-500">Không tìm thấy đơn hàng</p>
                <Button onClick={() => navigate('/orders')}>Quay lại</Button>
            </div>
        );
    }

    const config = STATUS_CONFIG[order.status] || { label: 'Không xác định', color: 'default', stepIndex: 0 };
    const minutesSince = (Date.now() - new Date(order.placedAt)) / (1000 * 60);
    const canCancelOrRequest = order.status < 5 && order.status !== 6 && order.status !== 7;

    const handleCancel = async () => {
        setCancelling(true);
        try {
            const res = await axios.patch(`/v1/api/orders/${order._id}/cancel`, { reason: cancelReason });
            if (res?.EC === 0) {
                message.success(res.message);
                setShowCancelModal(false);
                fetchOrder();
            } else {
                message.error(res?.EM || 'Không thể hủy đơn hàng');
            }
        } catch {
            message.error('Lỗi kết nối');
        } finally {
            setCancelling(false);
        }
    };

    const isCancelledOrRequested = order.status === 6 || order.status === 7;

    return (
        <div className="min-h-screen bg-slate-50 py-8">
            <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-20">
                {/* Back */}
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate('/orders')}
                    className="mb-6 rounded-xl"
                    type="text"
                >
                    Quay lại đơn hàng
                </Button>

                {/* Title */}
                <div className="flex items-center justify-between flex-wrap gap-2 mb-6">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Chi tiết đơn hàng</h1>
                        <p className="text-xs text-gray-400 font-mono mt-1">#{order._id}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Tag color={config.color} icon={config.icon} className="text-sm px-3 py-1">
                            {config.label}
                        </Tag>
                        {canCancelOrRequest && (
                            <Button
                                danger
                                size="small"
                                icon={<CloseCircleOutlined />}
                                onClick={() => setShowCancelModal(true)}
                                className="rounded-lg"
                            >
                                {order.status >= 3 ? 'Yêu cầu hủy' : 'Hủy đơn'}
                            </Button>
                        )}
                    </div>
                </div>

                {/* Order progress */}
                {!isCancelledOrRequested ? (
                    <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
                        <h2 className="font-semibold text-gray-900 mb-5">Trạng thái đơn hàng</h2>
                        <Steps
                            current={config.stepIndex}
                            items={STEPS}
                            size="small"
                            className="mb-2"
                        />
                    </div>
                ) : (
                    <div className={`rounded-2xl p-4 mb-4 ${order.status === 6 ? 'bg-red-50 border border-red-200' : 'bg-orange-50 border border-orange-200'}`}>
                        <div className="flex items-center gap-2">
                            <CloseCircleOutlined className={order.status === 6 ? 'text-red-500' : 'text-orange-500'} />
                            <p className={`font-semibold ${order.status === 6 ? 'text-red-700' : 'text-orange-700'}`}>
                                {config.label}
                            </p>
                        </div>
                        {order.status === 7 && (
                            <p className="text-orange-600 text-sm mt-1 ml-6">
                                Shop đang xem xét yêu cầu hủy của bạn. Vui lòng chờ phản hồi.
                            </p>
                        )}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-4">
                    {/* Shipping info */}
                    <div className="bg-white rounded-2xl shadow-sm p-5">
                        <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <EnvironmentOutlined className="text-red-500" />
                            Thông tin giao hàng
                        </h2>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-gray-700">
                                <UserOutlined className="text-gray-400" />
                                <span>{order.shippingInfo?.fullName}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-700">
                                <PhoneOutlined className="text-gray-400" />
                                <span>{order.shippingInfo?.phone}</span>
                            </div>
                            <div className="flex items-start gap-2 text-gray-700">
                                <EnvironmentOutlined className="text-gray-400 mt-0.5" />
                                <span>{order.shippingInfo?.address}</span>
                            </div>
                            {order.shippingInfo?.note && (
                                <div className="mt-2 p-2 bg-gray-50 rounded-lg text-gray-500 text-xs">
                                    {order.shippingInfo.note}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Payment & Summary */}
                    <div className="bg-white rounded-2xl shadow-sm p-5">
                        <h2 className="font-semibold text-gray-900 mb-3">Thanh toán & Tổng kết</h2>
                        <div className="space-y-2 text-sm text-gray-700">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Phương thức</span>
                                <Tag color="blue">{order.paymentMethod}</Tag>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Ngày đặt</span>
                                <span>{new Date(order.placedAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <Divider className="my-2" />
                            <div className="flex justify-between">
                                <span className="text-gray-500">Tạm tính</span>
                                <span>{(order.totalAmount - order.shippingFee).toLocaleString('vi-VN')}đ</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Phí vận chuyển</span>
                                <span>+{order.shippingFee.toLocaleString('vi-VN')}đ</span>
                            </div>
                            <Divider className="my-2" />
                            <div className="flex justify-between font-bold text-gray-900">
                                <span>Tổng cộng</span>
                                <span className="text-red-600 text-base">{order.totalAmount.toLocaleString('vi-VN')}đ</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products */}
                <div className="bg-white rounded-2xl shadow-sm p-5 mb-4">
                    <h2 className="font-semibold text-gray-900 mb-4">
                        Sản phẩm ({order.items.length})
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 divide-y lg:divide-y-0">
                        {order.items.map((item, idx) => {
                            const discount = Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100);
                            return (
                                <div key={idx} className="flex gap-4 items-center py-3 border-b border-gray-50 last:border-0">
                                    <div className="w-16 h-16 bg-gray-50 rounded-xl border border-gray-100 overflow-hidden flex-shrink-0">
                                        <img
                                            src={item.image || 'https://via.placeholder.com/64?text=?'}
                                            alt={item.name}
                                            onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/64?text=?')}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-900 text-sm line-clamp-2">{item.name}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-red-600 text-sm font-semibold">
                                                {item.price.toLocaleString('vi-VN')}đ
                                            </span>
                                            {discount > 0 && (
                                                <Tag color="red" className="text-xs">-{discount}%</Tag>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className="text-xs text-gray-400">x{item.quantity}</p>
                                        <p className="font-semibold text-gray-800 text-sm">
                                            {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                    {/* Status History Timeline */}
                    {order.statusHistory?.length > 0 && (
                        <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm p-5">
                            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <ClockCircleOutlined className="text-red-500" />
                                Lịch sử trạng thái
                            </h2>
                        <Timeline
                            items={[...order.statusHistory].reverse().map((h) => {
                                const sc = STATUS_CONFIG[h.status] || {};
                                return {
                                    color: sc.color === 'green' ? 'green' : sc.color === 'red' ? 'red' : 'blue',
                                    children: (
                                        <div>
                                            <p className="font-medium text-gray-800 text-sm">{sc.label || `Trạng thái ${h.status}`}</p>
                                            {h.note && <p className="text-gray-500 text-xs mt-0.5">{h.note}</p>}
                                            <p className="text-gray-400 text-xs mt-1">
                                                {new Date(h.changedAt).toLocaleDateString('vi-VN', {
                                                    day: '2-digit', month: '2-digit', year: 'numeric',
                                                    hour: '2-digit', minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    ),
                                };
                            })}
                        />
                        </div>
                    )}
                </div>
            </div>

            {/* Cancel Modal */}
            <Modal
                title={order.status >= 3 ? 'Gửi yêu cầu hủy đơn' : 'Xác nhận hủy đơn hàng'}
                open={showCancelModal}
                onCancel={() => setShowCancelModal(false)}
                footer={[
                    <Button key="back" onClick={() => setShowCancelModal(false)}>Không hủy</Button>,
                    <Button key="confirm" danger loading={cancelling} onClick={handleCancel}>
                        {order.status >= 3 ? 'Gửi yêu cầu hủy' : 'Xác nhận hủy'}
                    </Button>,
                ]}
            >
                {order.status >= 3 ? (
                    <p className="text-gray-600 mb-3">
                        Đơn hàng đang ở trạng thái <strong>{config.label}</strong>.
                        Bạn chỉ có thể gửi yêu cầu hủy, shop sẽ xem xét và phản hồi.
                    </p>
                ) : minutesSince > 30 ? (
                    <p className="text-orange-600 mb-3">
                        Đã quá 30 phút kể từ khi đặt hàng. Yêu cầu hủy sẽ được gửi tới shop.
                    </p>
                ) : (
                    <p className="text-gray-600 mb-3">
                        Bạn có thể hủy đơn trong {Math.max(0, Math.round(30 - minutesSince))} phút nữa.
                    </p>
                )}
                <div>
                    <label className="text-sm text-gray-700 font-medium">Lý do (tùy chọn):</label>
                    <textarea
                        className="w-full mt-2 border border-gray-200 rounded-xl p-3 text-sm resize-none focus:outline-none focus:border-red-400"
                        rows={3}
                        placeholder="Nhập lý do hủy đơn..."
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                    />
                </div>
            </Modal>
        </div>
    );
};

export default OrderDetailPage;
