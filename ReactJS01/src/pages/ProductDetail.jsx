import React, { useState } from 'react';
import { ShoppingCartOutlined, HeartOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Card, Button, InputNumber, Tabs, Image, Rate, Badge, Table } from 'antd';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const ProductCard = ({ product, onViewDetail }) => {
    const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    const [imgLoaded, setImgLoaded] = useState(false);
    const fallback = 'https://via.placeholder.com/420x280?text=No+Image';

    return (
        <div className="group h-full">
            {discount > 0 ? (
                <Badge.Ribbon text={`-${discount}%`} color="red">
                    <InnerCard />
                </Badge.Ribbon>
            ) : (
                <InnerCard />
            )}
        </div>
    );

    function InnerCard() {
        return (
            <Card
                hoverable
                className="h-full border-none shadow-md hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden cursor-pointer"
                bodyStyle={{ padding: '10px' }}
                onClick={() => onViewDetail(product.id)}
            >
                <div className="relative flex flex-col h-full">
                    <div className="relative w-full h-32 bg-gray-100 rounded-md overflow-hidden mb-2">
                        {!imgLoaded && <div className="absolute inset-0 bg-gray-200 animate-pulse" />}
                        <img
                            alt={product.name}
                            src={product.image}
                            onError={(e) => (e.currentTarget.src = fallback)}
                            onLoad={() => setImgLoaded(true)}
                            loading="lazy"
                            className="w-full h-full object-contain transition-transform duration-500 transform group-hover:scale-105"
                        />
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button shape="circle" icon={<HeartOutlined />} size="small" onClick={(e) => e.stopPropagation()} />
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col">
                        <div className="text-xs text-gray-400 mb-1 uppercase tracking-wider font-semibold">Laptop</div>
                        <h3 className="font-semibold text-xs mb-2 line-clamp-2 text-gray-900 flex-1">{product.name}</h3>

                        <div className="flex items-center gap-1 mb-2">
                            <Rate value={product.rating} disabled allowHalf style={{ fontSize: 10 }} />
                            <span className="text-xs text-gray-400">({product.sales})</span>
                        </div>

                        <div className="mt-auto">
                            <div className="mb-2">
                                <div className="text-base font-bold text-red-600">{product.price.toLocaleString('vi-VN')}đ</div>
                                <div className="text-xs text-gray-400 line-through">{product.originalPrice.toLocaleString('vi-VN')}đ</div>
                            </div>

                            <Button
                                type="primary"
                                block
                                danger
                                icon={<ShoppingCartOutlined />}
                                className="rounded-lg font-semibold text-xs h-8 bg-gradient-to-r from-red-500 to-orange-500 border-none hover:opacity-95"
                                onClick={(e) => e.stopPropagation()}
                            >
                                Thêm vào giỏ
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>
        );
    }
};

const ProductDetail = () => {
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(1);
    const [liked, setLiked] = useState(false);

    const product = {
        id: 1,
        name: 'Laptop Dell XPS 13 Plus 9320 i7-1260P',
        price: 25000000,
        originalPrice: 30000000,
        rating: 4.5,
        reviews: 156,
        stock: 25,
        sold: 1250,
        category: 'Laptop',
        subcategory: 'Laptop Dell',
        specs: {
            'CPU': 'Intel Core i7-1260P',
            'RAM': '16GB LPDDR5',
            'SSD': '512GB NVMe',
            'Màn hình': '13.4 inch FHD+',
            'Trọng lượng': '1.2kg',
            'Pin': '63 Wh, 12+ giờ',
        },
        images: [
            'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&q=80&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&q=80&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&q=80&auto=format&fit=crop',
        ],
        description: 'Laptop cao cấp với hiệu năng mạnh mẽ, thiết kế tối giản, thích hợp cho các chuyên gia và sinh viên.',
    };

    const similarProducts = Array.from({ length: 4 }).map((_, i) => ({
        id: i + 10,
        name: i % 2 === 0 ? 'Laptop Dell XPS 13 Plus 9320 i7-1260P' : 'Laptop MacBook Air M3 13 inch 2026',
        price: 25000000 + i * 500000,
        originalPrice: 30000000 + i * 500000,
        rating: 4.5,
        sales: 120 + i * 10,
        image: i % 2 === 0
            ? 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&q=80&auto=format&fit=crop'
            : 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80&auto=format&fit=crop',
    }));

    const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

    const handleViewDetail = (productId) => {
        navigate(`/products/${productId}`);
    };

    const specsColumns = [
        {
            title: 'Thông số',
            dataIndex: 'key',
            key: 'key',
            width: '30%',
            render: (text) => <span className="font-semibold text-gray-700">{text}</span>,
        },
        {
            title: 'Chi tiết',
            dataIndex: 'value',
            key: 'value',
            render: (text) => <span className="text-gray-600">{text}</span>,
        },
    ];

    const specsData = Object.entries(product.specs).map(([key, value]) => ({
        key: key,
        value: value,
    }));

    return (
        <div className="bg-slate-50 min-h-screen">
            <main className="max-w-[1500px] mx-auto w-full px-12 sm:px-14 lg:px-20 xl:px-24 py-8">
                <div className="mb-8 text-sm text-gray-600">
                    <span
                        className="cursor-pointer hover:text-red-500 font-medium"
                        onClick={() => navigate('/')}
                    >
                        Trang chủ
                    </span>
                    <span className="mx-2">/</span>
                    <span className="cursor-pointer hover:text-red-500 font-medium">
                        {product.category}
                    </span>
                    <span className="mx-2">/</span>
                    <span className="text-red-600 font-semibold">{product.subcategory}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                        <Swiper
                            modules={[Navigation, Pagination]}
                            navigation
                            pagination={{ clickable: true }}
                            className="rounded-lg overflow-hidden"
                        >
                            {product.images.map((img, idx) => (
                                <SwiperSlide key={idx} className="bg-gray-100 flex items-center justify-center h-96">
                                    <Image
                                        src={img}
                                        alt={`${product.name} ${idx + 1}`}
                                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                        preview
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>

                    <div className="bg-white rounded-2xl p-8 shadow-sm">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <h1 className="text-2xl lg:text-3xl font-black text-gray-900 mb-3">{product.name}</h1>
                                <div className="flex items-center gap-4 flex-wrap mb-4">
                                    <div className="flex items-center gap-2">
                                        <Rate value={product.rating} disabled allowHalf style={{ color: '#ffc069', fontSize: 16 }} />
                                        <span className="text-sm text-gray-600">({product.reviews} đánh giá)</span>
                                    </div>
                                    <span className="text-sm text-red-600 font-semibold">Đã bán {product.sold}</span>
                                </div>
                            </div>
                            <Button
                                shape="circle"
                                icon={<HeartOutlined />}
                                size="large"
                                onClick={() => setLiked(!liked)}
                                style={{ color: liked ? 'red' : 'gray', borderColor: liked ? 'red' : 'gray' }}
                            />
                        </div>

                        <div className="border-t border-b border-gray-200 py-6 mb-6">
                            <div className="flex items-center gap-4 mb-3 flex-wrap">
                                <span className="text-3xl lg:text-4xl font-black text-red-600">{product.price.toLocaleString('vi-VN')}đ</span>
                                <span className="text-lg text-gray-400 line-through">{product.originalPrice.toLocaleString('vi-VN')}đ</span>
                                <Badge color="red" text={`Tiết kiệm ${discount}%`} />
                            </div>
                        </div>

                        <div className="mb-6">
                            <p className="text-sm text-gray-600 mb-2">
                                Kho hàng: <span className={product.stock > 10 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                                    {product.stock > 0 ? `${product.stock} sản phẩm` : 'Hết hàng'}
                                </span>
                            </p>
                        </div>

                        <div className="mb-6">
                            <p className="text-sm font-semibold mb-3">Số lượng</p>
                            <div className="flex items-center gap-3">
                                <Button
                                    icon={<MinusOutlined />}
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    disabled={quantity === 1}
                                />
                                <InputNumber
                                    value={quantity}
                                    onChange={(val) => setQuantity(val || 1)}
                                    min={1}
                                    max={product.stock}
                                    style={{ width: '80px' }}
                                    controls={false}
                                    className="text-center [&_input]:text-center"
                                />
                                <Button
                                    icon={<PlusOutlined />}
                                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                    disabled={quantity === product.stock}
                                />
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button
                                type="primary"
                                danger
                                size="large"
                                block
                                icon={<ShoppingCartOutlined />}
                                className="rounded-lg font-semibold h-12 bg-gradient-to-r from-red-500 to-orange-500 border-none hover:opacity-95"
                                disabled={product.stock === 0}
                            >
                                Thêm vào giỏ ({quantity})
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm mb-12">
                    <Tabs
                        defaultActiveKey="1"
                        items={[
                            {
                                key: '1',
                                label: 'Thông số kỹ thuật',
                                children: (
                                    <div className="p-6">
                                        <Table
                                            columns={specsColumns}
                                            dataSource={specsData}
                                            pagination={false}
                                            bordered
                                            size="middle"
                                        />
                                    </div>
                                ),
                            },
                            {
                                key: '2',
                                label: 'Mô tả chi tiết',
                                children: <div className="p-6"><p className="text-gray-700 leading-relaxed text-base">{product.description}</p></div>,
                            },
                        ]}
                    />
                </div>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Sản phẩm tương tự</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                        {similarProducts.map((p) => (
                            <ProductCard key={p.id} product={p} onViewDetail={handleViewDetail} />
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default ProductDetail;