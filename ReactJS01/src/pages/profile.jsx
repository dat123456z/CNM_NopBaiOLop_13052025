import React, { useContext, useState, useEffect } from "react";
import { Form, Input, Button, Card, Avatar, notification, Typography } from "antd";
import { UserOutlined, MailOutlined, PhoneOutlined, SaveOutlined } from "@ant-design/icons";
import { AuthContext } from "../components/context/auth.context";
import { updateProfileApi } from "../util/api";

const { Title, Paragraph } = Typography;

const ProfilePage = () => {
    const { auth, setAuth } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        if (auth?.isAuthenticated && auth?.user) {
            form.setFieldsValue({
                email: auth.user.email,
                name: auth.user.name,
                phone: auth.user.phone || "",
                address: auth.user.address || "",
            });
        }
    }, [auth, form]);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const res = await updateProfileApi(values.name, values.phone, values.address);
            if (res && res.EC === 0) {
                notification.success({
                    message: "Thành công",
                    description: res.EM || "Cập nhật thông tin cá nhân thành công!",
                });
                
                // Update Context state immediately so changes reflect everywhere (e.g. Header welcome message)
                setAuth((prev) => ({
                    ...prev,
                    user: {
                        ...prev.user,
                        name: values.name,
                        phone: values.phone,
                        address: values.address,
                    },
                }));
            } else {
                notification.error({
                    message: "Thất bại",
                    description: res?.EM || "Có lỗi xảy ra khi cập nhật thông tin.",
                });
            }
        } catch (error) {
            console.error("Update profile error:", error);
            notification.error({
                message: "Lỗi",
                description: "Không thể kết nối đến máy chủ.",
            });
        } finally {
            setLoading(false);
        }
    };

    if (!auth?.isAuthenticated) {
        return (
            <div className="flex justify-center items-center min-h-[70vh]">
                <Card className="shadow-lg rounded-2xl p-6 text-center max-w-sm">
                    <Title level={4} className="text-red-500">Truy cập bị từ chối</Title>
                    <Paragraph>Vui lòng đăng nhập để xem và chỉnh sửa thông tin cá nhân của bạn.</Paragraph>
                </Card>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 min-h-[calc(100vh-64px)] py-12 px-4 flex justify-center items-center">
            <div className="w-full max-w-xl">
                <Card 
                    className="shadow-xl rounded-3xl overflow-hidden border-none bg-white"
                    bodyStyle={{ padding: 0 }}
                >
                    {/* Header Banner */}
                    <div className="bg-gradient-to-r from-red-500 to-orange-500 h-32 relative">
                        <div className="absolute -bottom-10 left-8">
                            <Avatar 
                                size={80} 
                                icon={<UserOutlined />} 
                                className="border-4 border-white bg-slate-100 text-red-500 shadow-md flex items-center justify-center"
                            />
                        </div>
                    </div>
                    
                    <div className="pt-14 pb-10 px-8 sm:px-10">
                        <div className="text-left mb-6">
                            <Title level={3} style={{ margin: 0 }} className="text-gray-900 font-bold">
                                {auth.user.name || "Người dùng"}
                            </Title>
                            <Paragraph className="text-gray-400 mt-1 mb-0">
                                {auth.user.email}
                            </Paragraph>
                        </div>

                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onFinish}
                            requiredMark={false}
                            className="space-y-4"
                        >
                            <Form.Item
                                label="Địa chỉ Email"
                                name="email"
                            >
                                <Input 
                                    prefix={<MailOutlined className="text-gray-400" />} 
                                    disabled 
                                    className="h-10 rounded-lg bg-gray-50 border-gray-200"
                                />
                            </Form.Item>

                            <Form.Item
                                label="Họ và Tên"
                                name="name"
                                rules={[{ required: true, message: "Vui lòng nhập họ tên của bạn!" }]}
                            >
                                <Input 
                                    prefix={<UserOutlined className="text-gray-400" />} 
                                    placeholder="Nhập họ và tên"
                                    className="h-10 rounded-lg border-gray-200 hover:border-red-400 focus:border-red-400"
                                />
                            </Form.Item>

                            <Form.Item
                                label="Số điện thoại"
                                name="phone"
                                rules={[
                                    { 
                                        pattern: /^[0-9]{10,11}$/, 
                                        message: "Số điện thoại không hợp lệ! Vui lòng nhập từ 10-11 chữ số." 
                                    }
                                ]}
                            >
                                <Input 
                                    prefix={<PhoneOutlined className="text-gray-400" />} 
                                    placeholder="Nhập số điện thoại"
                                    className="h-10 rounded-lg border-gray-200 hover:border-red-400 focus:border-red-400"
                                />
                            </Form.Item>

                            <Form.Item
                                label="Địa chỉ nhận hàng"
                                name="address"
                            >
                                <Input.TextArea 
                                    placeholder="Nhập địa chỉ nhà cụ thể (ví dụ: 123 Đường ABC, Quận 1, TP. HCM)"
                                    rows={3}
                                    className="rounded-lg border-gray-200 hover:border-red-400 focus:border-red-400"
                                />
                            </Form.Item>

                            <Form.Item className="mb-0 pt-4">
                                <Button 
                                    type="primary" 
                                    htmlType="submit" 
                                    loading={loading}
                                    icon={<SaveOutlined />}
                                    className="w-full h-11 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 border-none rounded-lg text-sm font-semibold shadow-md flex items-center justify-center gap-2"
                                >
                                    Lưu thay đổi
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default ProfilePage;
