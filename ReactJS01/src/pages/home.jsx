import React, { useState, useMemo } from 'react';
import { ShoppingCartOutlined, FireOutlined, TagOutlined, HeartOutlined, SearchOutlined, FilterOutlined } from '@ant-design/icons';
import { Card, Rate, Button, Badge, Input, Slider, Checkbox, Drawer, Select } from 'antd';
import { useNavigate } from 'react-router-dom';

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

const HomePage = () => {
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState('');
    const [priceRange, setPriceRange] = useState([0, 50000000]);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [sortBy, setSortBy] = useState('newest');
    const [drawerVisible, setDrawerVisible] = useState(false);

    const allProducts = Array.from({ length: 8 }).map((_, i) => ({
        id: i + 1,
        name: i % 2 === 0 ? 'Laptop Dell XPS 13 Plus 9320 i7-1260P' : 'Laptop MacBook Air M3 13 inch 2026',
        price: 25000000 + i * 500000,
        originalPrice: 30000000 + i * 500000,
        rating: 4.5,
        sales: 120 + i * 10,
        brand: i % 2 === 0 ? 'Dell' : 'MacBook',
        image:
            i % 2 === 0
                ? 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&q=80&auto=format&fit=crop'
                : 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80&auto=format&fit=crop',
    }));

    const brands = ['Dell', 'MacBook', 'Asus', 'HP', 'Lenovo'];
    const promotions = [
        { title: 'Flash Sale Giảm 50%', icon: <TagOutlined />, color: 'from-orange-400 to-red-500' },
        { title: 'Quà Tặng Công Nghệ', icon: <FireOutlined />, color: 'from-blue-400 to-indigo-500' },
        { title: 'Giao Nhanh 2H', icon: <ShoppingCartOutlined />, color: 'from-green-400 to-teal-500' },
    ];

    const filteredProducts = useMemo(() => {
        return allProducts.filter((product) => {
            const matchSearch = product.name.toLowerCase().includes(searchText.toLowerCase());
            const matchPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
            const matchBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);

            return matchSearch && matchPrice && matchBrand;
        });
    }, [searchText, priceRange, selectedBrands]);

    const sortedProducts = useMemo(() => {
        const sorted = [...filteredProducts];
        switch (sortBy) {
            case 'newest':
                return sorted.reverse();
            case 'price-asc':
                return sorted.sort((a, b) => a.price - b.price);
            case 'price-desc':
                return sorted.sort((a, b) => b.price - a.price);
            case 'best-seller':
                return sorted.sort((a, b) => b.sales - a.sales);
            default:
                return sorted;
        }
    }, [filteredProducts, sortBy]);

    const handleBrandChange = (brand) => {
        if (selectedBrands.includes(brand)) {
            setSelectedBrands(selectedBrands.filter((b) => b !== brand));
        } else {
            setSelectedBrands([...selectedBrands, brand]);
        }
    };

    const resetFilters = () => {
        setSearchText('');
        setPriceRange([0, 50000000]);
        setSelectedBrands([]);
        setSortBy('newest');
    };

    const handleViewDetail = (productId) => {
        navigate(`/products/${productId}`);
    };

    return (
        <div className="bg-slate-50 min-h-screen w-full overflow-x-hidden">
            <main className="max-w-[1500px] mx-auto w-full px-12 sm:px-14 lg:px-20 xl:px-24 py-8">
                <section className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch mb-10">
                    <div className="xl:col-span-8 relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-gray-900 to-red-950 text-white shadow-2xl min-h-[220px]">
                        <div className="absolute inset-0 opacity-25 pointer-events-none">
                            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-red-500 blur-3xl" />
                            <div className="absolute -bottom-24 -left-16 w-72 h-72 rounded-full bg-orange-500 blur-3xl" />
                        </div>

                        <div className="relative px-8 py-12 sm:px-10 sm:py-14 lg:px-12 lg:py-14">
                            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs sm:text-sm text-white/90 mb-4 backdrop-blur">
                                <FireOutlined />
                                Khuyến mãi cực sốc hôm nay
                            </div>

                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight tracking-tight mb-3 break-words">
                                Thế Hệ Laptop{' '}
                                <span className="bg-gradient-to-r from-red-400 via-amber-300 to-yellow-200 bg-clip-text text-transparent">
                                    Mới Nhất 2026
                                </span>
                            </h1>

                            <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6 max-w-lg">
                                Trải nghiệm sức mạnh đột phá từ chip M4 và Intel Core Ultra 3, thiết kế mỏng nhẹ, hiệu năng vượt trội.
                            </p>

                            <div className="flex flex-wrap gap-3">
                                <Button type="primary" danger size="large" className="rounded-full px-7 h-11 font-semibold text-sm">
                                    Khám phá ngay
                                </Button>
                                <Button size="large" className="rounded-full px-7 h-11 font-semibold border-white/20 text-white bg-white/10 hover:bg-white/20 text-sm">
                                    Xem ưu đãi
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="xl:col-span-4 grid grid-cols-1 gap-4">
                        {promotions.map((promo, idx) => (
                            <div key={idx} className={`rounded-2xl p-[1px] shadow-lg bg-gradient-to-r ${promo.color}`}>
                                <div className="bg-white rounded-2xl p-4 flex items-center gap-4 h-full">
                                    <div className="text-2xl p-3 rounded-xl bg-gray-50 text-gray-700 flex-shrink-0">
                                        {promo.icon}
                                    </div>
                                    <div className="font-semibold text-gray-800 text-sm">{promo.title}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="mb-6">
                    <Input
                        placeholder="Tìm kiếm sản phẩm..."
                        prefix={<SearchOutlined />}
                        size="large"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="rounded-lg"
                        style={{ height: '44px' }}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
                    <div className="hidden lg:block pl-8">
                        <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-20 space-y-6 h-fit">
                            <h3 className="text-lg font-bold text-gray-900">Bộ lọc</h3>

                            <div>
                                <p className="font-semibold text-gray-800 mb-3">Khoảng giá</p>
                                <Slider
                                    range
                                    min={0}
                                    max={50000000}
                                    step={1000000}
                                    value={priceRange}
                                    onChange={setPriceRange}
                                    marks={{ 0: '0đ', 50000000: '50M' }}
                                />
                                <div className="mt-3 text-sm text-gray-600">
                                    {priceRange[0].toLocaleString('vi-VN')}đ - {priceRange[1].toLocaleString('vi-VN')}đ
                                </div>
                            </div>

                            <div>
                                <p className="font-semibold text-gray-800 mb-3">Hãng sản xuất</p>
                                <div className="space-y-2">
                                    {brands.map((brand) => (
                                        <Checkbox
                                            key={brand}
                                            checked={selectedBrands.includes(brand)}
                                            onChange={() => handleBrandChange(brand)}
                                        >
                                            {brand}
                                        </Checkbox>
                                    ))}
                                </div>
                            </div>

                            <Button block onClick={resetFilters} className="border-red-500 text-red-500">
                                Xóa bộ lọc
                            </Button>
                        </div>
                    </div>

                    <div className="lg:col-span-3 flex flex-col">
                        <div className="flex items-center justify-between mb-6 gap-4">
                            <div className="flex-1">
                                <Select
                                    value={sortBy}
                                    onChange={setSortBy}
                                    style={{ width: '100%' }}
                                    options={[
                                        { label: 'Mới nhất', value: 'newest' },
                                        { label: 'Giá thấp đến cao', value: 'price-asc' },
                                        { label: 'Giá cao đến thấp', value: 'price-desc' },
                                        { label: 'Bán chạy nhất', value: 'best-seller' },
                                    ]}
                                />
                            </div>
                            <Button
                                icon={<FilterOutlined />}
                                size="large"
                                className="lg:hidden"
                                onClick={() => setDrawerVisible(true)}
                            >
                                Lọc
                            </Button>
                        </div>

                        <div className="mb-4 text-sm text-gray-600">
                            Tìm thấy <span className="font-semibold text-red-600">{sortedProducts.length}</span> sản phẩm
                        </div>

                        {sortedProducts.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                                {sortedProducts.map((p) => (
                                    <ProductCard key={p.id} product={p} onViewDetail={handleViewDetail} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-gray-600 text-lg">Không tìm thấy sản phẩm phù hợp</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Drawer
                title="Bộ lọc"
                onClose={() => setDrawerVisible(false)}
                open={drawerVisible}
                placement="left"
            >
                <div className="space-y-6">
                    <div>
                        <p className="font-semibold text-gray-800 mb-3">Khoảng giá</p>
                        <Slider
                            range
                            min={0}
                            max={50000000}
                            step={1000000}
                            value={priceRange}
                            onChange={setPriceRange}
                        />
                        <div className="mt-3 text-sm text-gray-600">
                            {priceRange[0].toLocaleString('vi-VN')}đ - {priceRange[1].toLocaleString('vi-VN')}đ
                        </div>
                    </div>

                    <div>
                        <p className="font-semibold text-gray-800 mb-3">Hãng sản xuất</p>
                        <div className="space-y-2">
                            {brands.map((brand) => (
                                <Checkbox
                                    key={brand}
                                    checked={selectedBrands.includes(brand)}
                                    onChange={() => handleBrandChange(brand)}
                                >
                                    {brand}
                                </Checkbox>
                            ))}
                        </div>
                    </div>

                    <Button block onClick={resetFilters} className="border-red-500 text-red-500">
                        Xóa bộ lọc
                    </Button>
                </div>
            </Drawer>
        </div>
    );
};

export default HomePage;