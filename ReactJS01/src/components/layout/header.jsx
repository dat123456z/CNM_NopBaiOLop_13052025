import React, { useContext, useState } from 'react';
import { UsergroupAddOutlined, HomeOutlined, SettingOutlined, LogoutOutlined, LoginOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/auth.context';

const Header = () => {
    const navigate = useNavigate();
    const { auth, setAuth } = useContext(AuthContext);
    const [current, setCurrent] = useState('home');

    const items = [
        {
            label: <Link to="/">Home Page</Link>,
            key: 'home',
            icon: <HomeOutlined />,
        },
        ...(auth?.isAuthenticated
            ? [
                {
                    label: <Link to="/user">Users</Link>,
                    key: 'user',
                    icon: <UsergroupAddOutlined />,
                },
            ]
            : []),
        {
            label: auth?.isAuthenticated ? `Welcome ${auth?.user?.email ?? ''}` : 'Tài khoản',
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