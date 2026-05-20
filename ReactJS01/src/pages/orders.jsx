import React, { useContext, useEffect, useState } from 'react';
import {
    Tag, Button, Empty, Spin, Tabs, Timeline, message, Popconfirm, Modal
} from 'antd';
import {
    OrderedListOutlined, EyeOutlined, CloseCircleOutlined,
    ClockCircleOutlined, CheckCircleOutlined, CarOutlined, GiftOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/context/auth.context';
import axios from '../util/axios.customize';

const STATUS_CONFIG = {
    1: { label: 'Đơn hàng mới', color: 'blue', icon: <ClockCircleOutlined /> },
    2: { label: 'Đã xác nhận', color: 'cyan', icon: <CheckCircleOutlined /> },
    3: { label: 'Đang chuẩn bị', color: 'orange', icon: <GiftOutlined /> },
    4: { label: 'Đang giao hàng', color: 'purple', icon: <CarOutlined /> },
    5: { label: 'Đã giao thành công', color: 'green', icon: <CheckCircleOutlined /> },
    6: { label: 'Đã hủy', color: 'red', icon: <CloseCircleOutlined /> },
    7: { label: 'Yêu cầu hủy', color: 'volcano', icon: <CloseCircleOutlined /> },
};

const OrderCard = ({ order, onRefresh }) => {
    const navigate = useNavigate();
    const [cancelling, setCancelling] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [showCancelModal, setShowCancelModal] = useState(false);

    const config = STATUS_CONFIG[order.status] || { label: 'Không xác định', color: 'default', icon: null };
    const minutesSince = (Date.now() - new Date(order.placedAt)) / (1000 * 60);
    const canCancelOrRequest = order.status < 5 && order.status !== 6 && order.status !== 7;

    const handleCancel = async () => {
        setCancelling(true);
        try {
            const res = await axios.patch(`/v1/api/orders/${order._id}/cancel`, { reason: cancelReason });
            if (res?.EC === 0) {
                message.success(res.message || 'Đã xử lý yêu cầu hủy');
                setShowCancelModal(false);
                onRefresh();
            } else {
                message.error(res?.EM || 'Không thể hủy đơn hàng');
            }
        } catch {
            message.error('Lỗi kết nối');
        } finally {
            setCancelling(false);
        }
    };

    const cancelLabel = order.status >= 3 ? 'Gửi yêu cầu hủy' : (minutesSince <= 30 ? 'Hủy đơn' : 'Hủy đơn');

    return (
        <>
            <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-all">
                {/* Header */}
                <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
                    <div>
                        <p className="text-xs text-gray-400 font-mono">#{order._id}</p>
                        <p className="text-xs text-gray-400 mt-1">
                            {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                                day: '2-digit', month: '2-digit', year: 'numeric',
                                hour: '2-digit', minute: '2-digit'
                            })}
                        </p>
                    </div>
                    <Tag
                        color={config.color}
                        icon={config.icon}
                        className="text-xs px-2 py-1 flex items-center gap-1"
                    >
                        {config.label}
                    </Tag>
                </div>

                {/* Items preview */}
                <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
                    {order.items.slice(0, 4).map((item, idx) => (
                        <div
                            key={idx}
                            className="relative flex-shrink-0 w-14 h-14 bg-gray-50 rounded-lg overflow-hidden border border-gray-100"
                        >
                            <img
                                src={item.image || 'https://via.placeholder.com/56?text=?'}
                                alt={item.name}
                                onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/56?text=?')}
                                className="w-full h-full object-contain"
                            />
                            {item.quantity > 1 && (
                                <span className="absolute bottom-0 right-0 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-tl-md">
                                    {item.quantity}
                                </span>
                            )}
                        </div>
                    ))}
                    {order.items.length > 4 && (
                        <div className="flex-shrink-0 w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-500 font-semibold">
                            +{order.items.length - 4}
                        </div>
                    )}
                </div>

                {/* Summary text */}
                <p className="text-xs text-gray-500 mb-1 line-clamp-1">
                    {order.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 flex-wrap gap-2">
                    <div>
                        <p className="text-xs text-gray-500">Tổng tiền</p>
                        <p className="font-bold text-red-600 text-base">
                            {order.totalAmount.toLocaleString('vi-VN')}đ
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {canCancelOrRequest && (
                            <Button
                                size="small"
                                danger
                                icon={<CloseCircleOutlined />}
                                onClick={() => setShowCancelModal(true)}
                                className="rounded-lg"
                            >
                                {cancelLabel}
                            </Button>
                        )}
                        <Button
                            size="small"
                            icon={<EyeOutlined />}
                            onClick={() => navigate(`/orders/${order._id}`)}
                            className="rounded-lg"
                        >
                            Chi tiết
                        </Button>
                    </div>
                </div>
            </div>

            {/* Cancel Modal */}
            <Modal
                title={order.status >= 3 ? 'Gửi yêu cầu hủy đơn' : 'Xác nhận hủy đơn hàng'}
                open={showCancelModal}
                onCancel={() => setShowCancelModal(false)}
                footer={[
                    <Button key="cancel" onClick={() => setShowCancelModal(false)}>Không hủy</Button>,
                    <Button
                        key="confirm"
                        danger
                        loading={cancelling}
                        onClick={handleCancel}
                    >
                        {order.status >= 3 ? 'Gửi yêu cầu hủy' : 'Xác nhận hủy'}
                    </Button>
                ]}
            >
                {order.status >= 3 ? (
                    <p className="text-gray-600 mb-3">
                        Đơn hàng đang ở trạng thái <strong>{config.label}</strong>. Bạn chỉ có thể gửi yêu cầu hủy để shop xem xét.
                    </p>
                ) : minutesSince > 30 ? (
                    <p className="text-orange-600 mb-3">Đã quá 30 phút kể từ khi đặt hàng. Bạn không thể hủy đơn trực tiếp.</p>
                ) : (
                    <p className="text-gray-600 mb-3">Bạn có còn {Math.max(0, Math.round(30 - minutesSince))} phút để hủy đơn.</p>
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
        </>
    );
};

const OrdersPage = () => {
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/v1/api/orders');
            if (res?.EC === 0) setOrders(res.orders);
        } catch (err) {
            message.error('Lỗi khi tải đơn hàng');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (auth?.isAuthenticated) fetchOrders();
        else setLoading(false);
    }, [auth?.isAuthenticated]);

    if (!auth?.isAuthenticated) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
                <p className="text-gray-500 text-lg">Vui lòng đăng nhập để xem đơn hàng</p>
                <Button type="primary" danger onClick={() => navigate('/login')}>Đăng nhập</Button>
            </div>
        );
    }

    const filterByStatus = (statuses) =>
        statuses ? orders.filter(o => statuses.includes(o.status)) : orders;

    const tabItems = [
        { key: 'all', label: `Tất cả (${orders.length})`, statuses: null },
        { key: 'active', label: 'Đang xử lý', statuses: [1, 2, 3, 4] },
        { key: 'done', label: 'Hoàn thành', statuses: [5] },
        { key: 'cancelled', label: 'Đã hủy', statuses: [6, 7] },
    ];

    return (
        <div className="min-h-screen bg-slate-50 py-8">
            <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-20">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <OrderedListOutlined className="text-red-500" />
                        Lịch sử đơn hàng
                    </h1>
                    <Button onClick={fetchOrders} className="rounded-xl">
                        Làm mới
                    </Button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Spin size="large" />
                    </div>
                ) : (
                    <Tabs
                        items={tabItems.map(tab => ({
                            key: tab.key,
                            label: tab.label,
                            children: (
                                <div>
                                    {filterByStatus(tab.statuses).length === 0 ? (
                                        <div className="bg-white rounded-2xl shadow-sm p-16">
                                            <Empty description="Không có đơn hàng nào" />
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                                            {filterByStatus(tab.statuses).map(order => (
                                                <OrderCard key={order._id} order={order} onRefresh={fetchOrders} />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ),
                        }))}
                    />
                )}
            </div>
        </div>
    );
};

export default OrdersPage;
