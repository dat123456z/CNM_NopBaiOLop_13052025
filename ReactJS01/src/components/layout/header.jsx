import React, { useContext, useState } from 'react';
import {
    UsergroupAddOutlined, HomeOutlined, SettingOutlined, LogoutOutlined,
    LoginOutlined, ShoppingCartOutlined, OrderedListOutlined
} from '@ant-design/icons';
import { Menu, Badge } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/auth.context';
import { CartContext } from '../context/cart.context';

const Header = () => {
    const navigate = useNavigate();
    const { auth, setAuth } = useContext(AuthContext);
    const { cartCount } = useContext(CartContext);
    const [current, setCurrent] = useState('home');

    const items = [
        {
            label: <Link to="/">Trang chủ</Link>,
            key: 'home',
            icon: <HomeOutlined />,
        },
        ...(auth?.isAuthenticated
            ? [
                {
                    label: <Link to="/user">Người dùng</Link>,
                    key: 'user',
                    icon: <UsergroupAddOutlined />,
                },
                {
                    label: (
                        <Link to="/cart">
                            <Badge count={cartCount} size="small" offset={[4, -2]}>
                                <span style={{ paddingRight: 6 }}>Giỏ hàng</span>
                            </Badge>
                        </Link>
                    ),
                    key: 'cart',
                    icon: <ShoppingCartOutlined />,
                },
                {
                    label: <Link to="/orders">Đơn hàng</Link>,
                    key: 'orders',
                    icon: <OrderedListOutlined />,
                },
            ]
            : []),
        {
            label: auth?.isAuthenticated ? `Xin chào, ${auth?.user?.name || auth?.user?.email || ''}` : 'Tài khoản',
            key: 'account',
            icon: <SettingOutlined />,
            children: auth?.isAuthenticated
                ? [
                    {
                        label: (
                            <span
                                onClick={() => {
                                    localStorage.removeItem('access_token');
                                    setAuth({
                                        isAuthenticated: false,
                                        user: { email: '', name: '' },
                                    });
                                    navigate('/');
                                }}
                            >
                                Đăng xuất
                            </span>
                        ),
                        key: 'logout',
                        icon: <LogoutOutlined />,
                    },
                ]
                : [
                    {
                        label: <Link to="/login">Đăng nhập</Link>,
                        key: 'login',
                        icon: <LoginOutlined />,
                    },
                ],
        },
    ];

    const onClick = (e) => {
        setCurrent(e.key);
    };

    return (
        <div className="bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-[1500px] mx-auto px-12 sm:px-14 lg:px-20 xl:px-24">
                <Menu
                    onClick={onClick}
                    selectedKeys={[current]}
                    mode="horizontal"
                    items={items}
                    className="border-b-0 justify-end"
                    style={{ display: 'flex', alignItems: 'center' }}
                />
            </div>
        </div>
    );
};

export default Header;