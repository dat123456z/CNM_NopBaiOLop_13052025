const Product = require('../models/product');

const seedProducts = async () => {
    try {
        const count = await Product.countDocuments();
        if (count >= 60) return;
        await Product.deleteMany({});
        const laptops = [
            { name: 'Laptop Dell XPS 13 Plus 9320 i7-1260P', brand: 'Dell', price: 28000000, originalPrice: 33000000, rating: 4.8, sales: 320, views: 1250, image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80', category: 'laptop' },
            { name: 'MacBook Air M3 13 inch 2024', brand: 'Apple', price: 29000000, originalPrice: 32000000, rating: 4.9, sales: 512, views: 2100, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80', category: 'laptop' },
            { name: 'ASUS ROG Zephyrus G14 2024 AMD Ryzen 9', brand: 'Asus', price: 35000000, originalPrice: 40000000, rating: 4.7, sales: 210, views: 980, image: 'https://images.unsplash.com/photo-1611078489935-0cb964de46d6?w=600&q=80', category: 'laptop' },
            { name: 'HP Spectre x360 14 i7-1355U 2024', brand: 'HP', price: 32000000, originalPrice: 37000000, rating: 4.6, sales: 175, views: 820, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80', category: 'laptop' },
            { name: 'Lenovo ThinkPad X1 Carbon Gen 12', brand: 'Lenovo', price: 38000000, originalPrice: 44000000, rating: 4.8, sales: 290, views: 1100, image: 'https://images.unsplash.com/photo-1542393545-10f5cde2c810?w=600&q=80', category: 'laptop' },
            { name: 'Dell Inspiron 15 3520 i5-1235U', brand: 'Dell', price: 17000000, originalPrice: 21000000, rating: 4.3, sales: 430, views: 1800, image: 'https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=600&q=80', category: 'laptop' },
            { name: 'MacBook Pro 14 M3 Pro 2024', brand: 'Apple', price: 52000000, originalPrice: 59000000, rating: 5.0, sales: 380, views: 2500, image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80', category: 'laptop' },
            { name: 'ASUS VivoBook 15 X1502ZA i5-12500H', brand: 'Asus', price: 14000000, originalPrice: 17000000, rating: 4.2, sales: 560, views: 2200, image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&q=80', category: 'laptop' },
            { name: 'HP Pavilion 15 i5-1335U', brand: 'HP', price: 15500000, originalPrice: 18500000, rating: 4.4, sales: 390, views: 1500, image: 'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=600&q=80', category: 'laptop' },
            { name: 'Lenovo IdeaPad 5 Pro Gen 8 Ryzen 7', brand: 'Lenovo', price: 19000000, originalPrice: 23000000, rating: 4.5, sales: 260, views: 970, image: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=600&q=80', category: 'laptop' },
            { name: 'MSI Modern 15 H B13M i7-13700H', brand: 'MSI', price: 22000000, originalPrice: 27000000, rating: 4.4, sales: 140, views: 650, image: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=600&q=80', category: 'laptop' },
            { name: 'Acer Aspire 5 A515 i5-1235U', brand: 'Acer', price: 13500000, originalPrice: 16000000, rating: 4.1, sales: 480, views: 1900, image: 'https://images.unsplash.com/photo-1504707748692-419802cf939d?w=600&q=80', category: 'laptop' },
            { name: 'Samsung Galaxy Book4 Pro 360', brand: 'Samsung', price: 33000000, originalPrice: 38000000, rating: 4.5, sales: 120, views: 760, image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&q=80', category: 'laptop' },
            { name: 'Dell XPS 15 9530 i9-13900H RTX 4070', brand: 'Dell', price: 55000000, originalPrice: 62000000, rating: 4.8, sales: 95, views: 880, image: 'https://images.unsplash.com/photo-1593642634315-48f5414c3ad9?w=600&q=80', category: 'laptop' },
            { name: 'Acer Predator Helios 16 i9-14900HX', brand: 'Acer', price: 42000000, originalPrice: 48000000, rating: 4.6, sales: 155, views: 720, image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&q=80', category: 'laptop' },
            { name: 'Lenovo Legion 5 Pro Gen 8 Ryzen 7', brand: 'Lenovo', price: 27000000, originalPrice: 32000000, rating: 4.7, sales: 310, views: 1350, image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&q=80', category: 'laptop' },
            { name: 'ASUS ZenBook 14 OLED UX3405 i7', brand: 'Asus', price: 24000000, originalPrice: 28000000, rating: 4.6, sales: 200, views: 1050, image: 'https://images.unsplash.com/photo-1616763355603-9755a912a37f?w=600&q=80', category: 'laptop' },
            { name: 'HP EliteBook 840 G10 i7-1355U', brand: 'HP', price: 30000000, originalPrice: 35000000, rating: 4.5, sales: 130, views: 580, image: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=600&q=80', category: 'laptop' },
            { name: 'Apple MacBook Pro 16 M3 Max', brand: 'Apple', price: 85000000, originalPrice: 95000000, rating: 5.0, sales: 210, views: 3200, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80', category: 'laptop' },
            { name: 'MSI Titan GT77 HX i9-13980HX RTX 4090', brand: 'MSI', price: 75000000, originalPrice: 88000000, rating: 4.9, sales: 45, views: 1800, image: 'https://images.unsplash.com/photo-1593640495253-23196b27a87f?w=600&q=80', category: 'laptop' },
        ];
        const phones = [
            { name: 'iPhone 16 Pro Max 256GB', brand: 'Apple', price: 34000000, originalPrice: 37000000, rating: 4.9, sales: 850, views: 4200, image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&q=80', category: 'phone' },
            { name: 'Samsung Galaxy S25 Ultra 512GB', brand: 'Samsung', price: 31000000, originalPrice: 35000000, rating: 4.8, sales: 710, views: 3600, image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&q=80', category: 'phone' },
            { name: 'Xiaomi 14 Ultra 12GB/512GB', brand: 'Xiaomi', price: 22000000, originalPrice: 26000000, rating: 4.6, sales: 330, views: 1700, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80', category: 'phone' },
            { name: 'OPPO Find X8 Pro 5G 256GB', brand: 'OPPO', price: 24000000, originalPrice: 28000000, rating: 4.5, sales: 290, views: 1400, image: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=600&q=80', category: 'phone' },
            { name: 'Google Pixel 9 Pro 128GB', brand: 'Google', price: 27000000, originalPrice: 30000000, rating: 4.7, sales: 200, views: 1100, image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600&q=80', category: 'phone' },
            { name: 'Vivo X200 Pro 5G 512GB', brand: 'Vivo', price: 20000000, originalPrice: 23000000, rating: 4.4, sales: 180, views: 900, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80', category: 'phone' },
            { name: 'Samsung Galaxy A55 5G 256GB', brand: 'Samsung', price: 9500000, originalPrice: 12000000, rating: 4.3, sales: 620, views: 2800, image: 'https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=600&q=80', category: 'phone' },
            { name: 'iPhone 15 128GB', brand: 'Apple', price: 21000000, originalPrice: 24000000, rating: 4.8, sales: 780, views: 3900, image: 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=600&q=80', category: 'phone' },
            { name: 'Xiaomi Redmi Note 13 Pro+ 256GB', brand: 'Xiaomi', price: 8900000, originalPrice: 11000000, rating: 4.4, sales: 540, views: 2100, image: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&q=80', category: 'phone' },
            { name: 'OPPO Reno 12 Pro 5G 256GB', brand: 'OPPO', price: 10500000, originalPrice: 13000000, rating: 4.3, sales: 350, views: 1300, image: 'https://images.unsplash.com/photo-1570101945621-945409a6370f?w=600&q=80', category: 'phone' },
            { name: 'Samsung Galaxy S24 FE 128GB', brand: 'Samsung', price: 12000000, originalPrice: 15000000, rating: 4.4, sales: 410, views: 1950, image: 'https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?w=600&q=80', category: 'phone' },
            { name: 'iPhone 16 128GB', brand: 'Apple', price: 23000000, originalPrice: 26000000, rating: 4.8, sales: 690, views: 3100, image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&q=80', category: 'phone' },
            { name: 'Xiaomi POCO X6 Pro 256GB', brand: 'Xiaomi', price: 7500000, originalPrice: 9500000, rating: 4.3, sales: 460, views: 1800, image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=600&q=80', category: 'phone' },
            { name: 'OnePlus 12 512GB', brand: 'OnePlus', price: 18000000, originalPrice: 22000000, rating: 4.6, sales: 230, views: 1050, image: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=600&q=80', category: 'phone' },
            { name: 'realme GT 6 5G 256GB', brand: 'Realme', price: 11000000, originalPrice: 13500000, rating: 4.2, sales: 280, views: 900, image: 'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=600&q=80', category: 'phone' },
        ];
        const tablets = [
            { name: 'iPad Pro M4 11 inch Wi-Fi 256GB', brand: 'Apple', price: 27000000, originalPrice: 30000000, rating: 4.9, sales: 420, views: 2100, image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80', category: 'tablet' },
            { name: 'Samsung Galaxy Tab S10+ 256GB', brand: 'Samsung', price: 21000000, originalPrice: 25000000, rating: 4.7, sales: 310, views: 1600, image: 'https://images.unsplash.com/photo-1587033411391-5d9e51cce126?w=600&q=80', category: 'tablet' },
            { name: 'iPad Air M2 13 inch 2024 128GB', brand: 'Apple', price: 22000000, originalPrice: 25000000, rating: 4.8, sales: 380, views: 1900, image: 'https://images.unsplash.com/photo-1559825481-12a05cc00344?w=600&q=80', category: 'tablet' },
            { name: 'Xiaomi Pad 6S Pro 256GB', brand: 'Xiaomi', price: 13000000, originalPrice: 15000000, rating: 4.5, sales: 220, views: 980, image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&q=80', category: 'tablet' },
            { name: 'Samsung Galaxy Tab A9+ LTE 64GB', brand: 'Samsung', price: 8000000, originalPrice: 10000000, rating: 4.2, sales: 450, views: 2000, image: 'https://images.unsplash.com/photo-1530319067432-f2a729c03db5?w=600&q=80', category: 'tablet' },
            { name: 'Lenovo Tab P12 Pro 256GB Wi-Fi', brand: 'Lenovo', price: 17000000, originalPrice: 20000000, rating: 4.4, sales: 160, views: 750, image: 'https://images.unsplash.com/photo-1519558260268-cde7e03a0152?w=600&q=80', category: 'tablet' },
            { name: 'iPad mini 7 Wi-Fi 128GB', brand: 'Apple', price: 16000000, originalPrice: 18500000, rating: 4.7, sales: 310, views: 1400, image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80', category: 'tablet' },
            { name: 'Samsung Galaxy Tab S9 FE 128GB', brand: 'Samsung', price: 10500000, originalPrice: 13000000, rating: 4.3, sales: 270, views: 1100, image: 'https://images.unsplash.com/photo-1587033411391-5d9e51cce126?w=600&q=80', category: 'tablet' },
            { name: 'Xiaomi Redmi Pad Pro 5G 256GB', brand: 'Xiaomi', price: 9000000, originalPrice: 11000000, rating: 4.3, sales: 190, views: 780, image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&q=80', category: 'tablet' },
            { name: 'OPPO Pad 2 8GB/256GB', brand: 'OPPO', price: 11000000, originalPrice: 13500000, rating: 4.2, sales: 145, views: 620, image: 'https://images.unsplash.com/photo-1559825481-12a05cc00344?w=600&q=80', category: 'tablet' },
        ];
        const accessories = [
            { name: 'Apple AirPods Pro 2nd Generation', brand: 'Apple', price: 6500000, originalPrice: 7800000, rating: 4.8, sales: 920, views: 4500, image: 'https://images.unsplash.com/photo-1606220838315-056192d5e927?w=600&q=80', category: 'accessory' },
            { name: 'Samsung Galaxy Buds3 Pro', brand: 'Samsung', price: 4800000, originalPrice: 5800000, rating: 4.6, sales: 560, views: 2600, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80', category: 'accessory' },
            { name: 'Logitech MX Master 3S Wireless Mouse', brand: 'Logitech', price: 2200000, originalPrice: 2800000, rating: 4.9, sales: 750, views: 3200, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&q=80', category: 'accessory' },
            { name: 'Apple Watch Series 10 45mm GPS', brand: 'Apple', price: 12500000, originalPrice: 14000000, rating: 4.8, sales: 480, views: 2300, image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&q=80', category: 'accessory' },
            { name: 'Samsung Galaxy Watch 7 44mm', brand: 'Samsung', price: 8500000, originalPrice: 10000000, rating: 4.5, sales: 310, views: 1500, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80', category: 'accessory' },
            { name: 'Anker PowerCore 26800mAh PD', brand: 'Anker', price: 1200000, originalPrice: 1600000, rating: 4.7, sales: 1100, views: 5000, image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&q=80', category: 'accessory' },
            { name: 'Sony WH-1000XM5 Wireless Headphones', brand: 'Sony', price: 8900000, originalPrice: 10500000, rating: 4.9, sales: 430, views: 2100, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80', category: 'accessory' },
            { name: 'Belkin 3-in-1 Wireless Charger MagSafe', brand: 'Belkin', price: 2800000, originalPrice: 3500000, rating: 4.4, sales: 280, views: 1100, image: 'https://images.unsplash.com/photo-1622985171099-9c1e9b0db5ed?w=600&q=80', category: 'accessory' },
            { name: 'Keychron K2 Pro Wireless Mechanical', brand: 'Keychron', price: 2500000, originalPrice: 3000000, rating: 4.8, sales: 380, views: 1700, image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&q=80', category: 'accessory' },
            { name: 'Dell UltraSharp U2723QE 27 4K Monitor', brand: 'Dell', price: 18000000, originalPrice: 21000000, rating: 4.8, sales: 190, views: 960, image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80', category: 'accessory' },
            { name: 'Logitech G Pro X Superlight 2', brand: 'Logitech', price: 3200000, originalPrice: 3800000, rating: 4.9, sales: 340, views: 1500, image: 'https://images.unsplash.com/photo-1563297007-0686b7003af7?w=600&q=80', category: 'accessory' },
            { name: 'Samsung T9 4TB Portable SSD', brand: 'Samsung', price: 4500000, originalPrice: 5500000, rating: 4.7, sales: 250, views: 1200, image: 'https://images.unsplash.com/photo-1601737487795-dab272f52420?w=600&q=80', category: 'accessory' },
            { name: 'Apple AirTag 4 Pack', brand: 'Apple', price: 2200000, originalPrice: 2700000, rating: 4.5, sales: 560, views: 2500, image: 'https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=600&q=80', category: 'accessory' },
            { name: 'Sony WF-1000XM5 True Wireless', brand: 'Sony', price: 5500000, originalPrice: 6500000, rating: 4.8, sales: 390, views: 1800, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80', category: 'accessory' },
            { name: 'Razer BlackWidow V4 Pro Mechanical', brand: 'Razer', price: 4200000, originalPrice: 5000000, rating: 4.7, sales: 210, views: 950, image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&q=80', category: 'accessory' },
        ];
        await Product.insertMany([...laptops, ...phones, ...tablets, ...accessories]);
        console.log('>>> Seeded ' + (laptops.length + phones.length + tablets.length + accessories.length) + ' products');
    } catch (err) { console.error('Seed error:', err); }
};

const getProductsByCategoryService = async (category, page = 1, limit = 8) => {
    try {
        const skip = (page - 1) * limit;
        const query = category && category !== 'all' ? { category } : {};
        const [products, total] = await Promise.all([
            Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
            Product.countDocuments(query),
        ]);
        return {
            EC: 0,
            data: products,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                totalPages: Math.ceil(total / limit),
                hasMore: skip + products.length < total,
            },
        };
    } catch (error) {
        console.error(error);
        return { EC: 1, EM: 'Loi khi lay san pham', data: [] };
    }
};

const getTopBestSellersService = async (limit = 10) => {
    try {
        const products = await Product.find({}).sort({ sales: -1 }).limit(Number(limit));
        return { EC: 0, data: products };
    } catch (error) {
        console.error(error);
        return { EC: 1, EM: 'Loi khi lay top ban chay', data: [] };
    }
};

const getTopMostViewedService = async (limit = 10) => {
    try {
        const products = await Product.find({}).sort({ views: -1 }).limit(Number(limit));
        return { EC: 0, data: products };
    } catch (error) {
        console.error(error);
        return { EC: 1, EM: 'Loi khi lay top xem nhieu', data: [] };
    }
};

module.exports = {
    seedProducts,
    getProductsByCategoryService,
    getTopBestSellersService,
    getTopMostViewedService,
};
