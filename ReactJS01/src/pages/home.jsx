import React, { useState, useEffect, useCallback } from "react";
import {
  ShoppingCartOutlined, FireOutlined, TagOutlined, HeartOutlined,
  SearchOutlined, FilterOutlined, EyeOutlined, LeftOutlined, RightOutlined,
  LoadingOutlined, AppstoreOutlined, LaptopOutlined, MobileOutlined,
  TabletOutlined, ToolOutlined,
} from "@ant-design/icons";
import {
  Card, Rate, Button, Badge, Input, InputNumber,
  Checkbox, Drawer, Select, Spin, Empty,
} from "antd";
import { useNavigate } from "react-router-dom";
import { getProductsByCategoryApi, getBestSellersApi, getMostViewedApi } from "../util/api";

const ProductCard = ({ product, onViewDetail, rank }) => {
  const discount =
    product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;
  const [imgLoaded, setImgLoaded] = useState(false);

  const Inner = () => (
    <Card hoverable bodyStyle={{ padding: "10px" }}
      className="h-full border-none shadow-md hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden cursor-pointer"
      onClick={() => onViewDetail(product._id || product.id)}>
      <div className="relative flex flex-col h-full">
        {rank && (
          <div className={`absolute top-2 left-2 z-10 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shadow ${rank === 1 ? "bg-yellow-400" : rank === 2 ? "bg-gray-400" : rank === 3 ? "bg-amber-600" : "bg-slate-500"}`}>
            {rank}
          </div>
        )}
        <div className="relative w-full h-32 bg-gray-100 rounded-md overflow-hidden mb-2 group">
          {!imgLoaded && <div className="absolute inset-0 bg-gray-200 animate-pulse" />}
          <img alt={product.name} src={product.image} loading="lazy"
            onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/420x280?text=No+Image")}
            onLoad={() => setImgLoaded(true)}
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button shape="circle" icon={<HeartOutlined />} size="small" onClick={(e) => e.stopPropagation()} />
          </div>
        </div>
        <div className="flex-1 flex flex-col">
          <div className="text-xs text-gray-400 mb-1 uppercase tracking-wider font-semibold">{product.brand}</div>
          <h3 className="font-semibold text-xs mb-2 line-clamp-2 text-gray-900 flex-1">{product.name}</h3>
          <div className="flex items-center gap-1 mb-1">
            <Rate value={product.rating} disabled allowHalf style={{ fontSize: 10 }} />
            <span className="text-xs text-gray-400">({product.sales?.toLocaleString()})</span>
          </div>
          {product.views !== undefined && (
            <div className="flex items-center gap-1 mb-2 text-xs text-gray-400">
              <EyeOutlined /> {product.views?.toLocaleString()} lượt xem
            </div>
          )}
          <div className="mt-auto">
            <div className="mb-2">
              <div className="text-base font-bold text-red-600">{product.price?.toLocaleString("vi-VN")}đ</div>
              {discount > 0 && <div className="text-xs text-gray-400 line-through">{product.originalPrice?.toLocaleString("vi-VN")}đ</div>}
            </div>
            <Button type="primary" block danger icon={<ShoppingCartOutlined />}
              className="rounded-lg font-semibold text-xs h-8 border-none"
              onClick={(e) => e.stopPropagation()}>
              Thêm vào giỏ
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="group h-full">
      {discount > 0 ? <Badge.Ribbon text={`-${discount}%`} color="red"><Inner /></Badge.Ribbon> : <Inner />}
    </div>
  );
};

/* ═══ TopProductsSection ═══ */
const ITEMS_PER_PAGE = 5;

const TopProductsSection = ({ onViewDetail }) => {
  const [activeTab, setActiveTab] = useState("best-sellers");
  const [bestSellers, setBestSellers] = useState([]);
  const [mostViewed, setMostViewed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  const products = activeTab === "best-sellers" ? bestSellers : mostViewed;
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const visible = products.slice(page * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE + ITEMS_PER_PAGE);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [bs, mv] = await Promise.all([getBestSellersApi(10), getMostViewedApi(10)]);
        if (bs?.EC === 0) setBestSellers(bs.data);
        if (mv?.EC === 0) setMostViewed(mv.data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex gap-2">
          {[
            { key: "best-sellers", label: "Bán Chạy Nhất", icon: <FireOutlined />, active: "from-red-500 to-orange-500" },
            { key: "most-viewed", label: "Xem Nhiều Nhất", icon: <EyeOutlined />, active: "from-blue-500 to-indigo-500" },
          ].map(tab => (
            <button key={tab.key} onClick={() => { setActiveTab(tab.key); setPage(0); }}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all ${activeTab === tab.key ? `bg-gradient-to-r ${tab.active} text-white shadow-md` : "bg-white text-gray-600 border border-gray-200 hover:border-red-400"}`}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
              className="w-8 h-8 rounded-full border flex items-center justify-center disabled:opacity-30 hover:border-red-400 hover:text-red-500">
              <LeftOutlined style={{ fontSize: 12 }} />
            </button>
            <span className="text-sm text-gray-500">{page + 1} / {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1}
              className="w-8 h-8 rounded-full border flex items-center justify-center disabled:opacity-30 hover:border-red-400 hover:text-red-500">
              <RightOutlined style={{ fontSize: 12 }} />
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Spin indicator={<LoadingOutlined style={{ fontSize: 32 }} />} /></div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {visible.map((p, idx) => (
            <ProductCard key={p._id} product={p} onViewDetail={onViewDetail} rank={page * ITEMS_PER_PAGE + idx + 1} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-1.5 mt-4">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button key={i} onClick={() => setPage(i)}
              className={`h-2 rounded-full transition-all ${i === page ? "w-6 bg-red-500" : "w-2 bg-gray-300"}`} />
          ))}
        </div>
      )}
    </section>
  );
};

/* ═══ AllProductsSection — Phân trang ═══ */
const CATEGORIES = [
  { key: "all", label: "Tất cả", icon: <AppstoreOutlined /> },
  { key: "laptop", label: "Laptop", icon: <LaptopOutlined /> },
  { key: "phone", label: "Điện thoại", icon: <MobileOutlined /> },
  { key: "tablet", label: "Máy tính bảng", icon: <TabletOutlined /> },
  { key: "accessory", label: "Phụ kiện", icon: <ToolOutlined /> },
];
const PAGE_SIZE = 8;

const AllProductsSection = ({ onViewDetail }) => {
  const [category, setCategory] = useState("all");
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [sortBy, setSortBy] = useState("newest");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [knownBrands, setKnownBrands] = useState([]);

  const doFetch = useCallback(async (cat, pg) => {
    setLoading(true);
    try {
      const res = await getProductsByCategoryApi(cat, pg, PAGE_SIZE);
      if (res && res.EC === 0) {
        setProducts(res.data);
        setTotalPages(res.pagination.totalPages || 1);
        setTotalItems(res.pagination.total || 0);
        setKnownBrands(prev => {
          const s = new Set([...prev, ...res.data.map(p => p.brand)]);
          return [...s].sort();
        });
      }
    } catch (e) {
      console.error("Fetch products error:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    setKnownBrands([]);
    setSelectedBrands([]);
    setSearchText("");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("newest");
    doFetch(category, 1);
  }, [category, doFetch]);

  const goToPage = (pg) => {
    if (pg < 1 || pg > totalPages) return;
    setCurrentPage(pg);
    doFetch(category, pg);
    document.getElementById("products-top")?.scrollIntoView({ behavior: "smooth" });
  };

  const filtered = products.filter(p => {
    if (searchText && !p.name.toLowerCase().includes(searchText.toLowerCase())) return false;
    if (minPrice !== "" && p.price < Number(minPrice)) return false;
    if (maxPrice !== "" && p.price > Number(maxPrice)) return false;
    if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "best-seller") return b.sales - a.sales;
    return 0;
  });

  const fmt = v => (v ? `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "");
  const parse = v => (v ? v.replace(/,/g, "") : "");

  const pageButtons = () => {
    const btns = [];
    const d = 2;
    const lo = Math.max(1, currentPage - d);
    const hi = Math.min(totalPages, currentPage + d);
    if (lo > 1) { btns.push(1); if (lo > 2) btns.push("..."); }
    for (let i = lo; i <= hi; i++) btns.push(i);
    if (hi < totalPages) { if (hi < totalPages - 1) btns.push("..."); btns.push(totalPages); }
    return btns;
  };

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <p className="font-semibold text-gray-800 mb-3">Khoảng giá</p>
        <div className="flex items-center gap-2">
          <InputNumber placeholder="Từ (đ)" value={minPrice === "" ? null : minPrice}
            onChange={v => setMinPrice(v ?? "")} min={0} formatter={fmt} parser={parse} style={{ width: "100%" }} />
          <span className="text-gray-400 flex-shrink-0">—</span>
          <InputNumber placeholder="Đến (đ)" value={maxPrice === "" ? null : maxPrice}
            onChange={v => setMaxPrice(v ?? "")} min={0} formatter={fmt} parser={parse} style={{ width: "100%" }} />
        </div>
        {(minPrice !== "" || maxPrice !== "") && (
          <p className="mt-2 text-xs text-gray-400">
            {minPrice !== "" ? `${Number(minPrice).toLocaleString("vi-VN")}đ` : "0đ"}
            {" "}—{" "}
            {maxPrice !== "" ? `${Number(maxPrice).toLocaleString("vi-VN")}đ` : "Không giới hạn"}
          </p>
        )}
      </div>
      {knownBrands.length > 0 && (
        <div>
          <p className="font-semibold text-gray-800 mb-3">Hãng sản xuất</p>
          <div className="space-y-2">
            {knownBrands.map(b => (
              <Checkbox key={b} checked={selectedBrands.includes(b)}
                onChange={() => setSelectedBrands(prev =>
                  prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b])}>
                {b}
              </Checkbox>
            ))}
          </div>
        </div>
      )}
      <Button block onClick={() => { setMinPrice(""); setMaxPrice(""); setSelectedBrands([]); setSortBy("newest"); }}
        className="border-red-500 text-red-500">
        Xóa bộ lọc
      </Button>
    </div>
  );

  return (
    <section id="products-top">
      <div className="flex gap-2 mb-6 flex-wrap">
        {CATEGORIES.map(cat => (
          <button key={cat.key} onClick={() => setCategory(cat.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all border ${category === cat.key ? "bg-red-500 text-white border-red-500 shadow" : "bg-white text-gray-600 border-gray-200 hover:border-red-400 hover:text-red-500"}`}>
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      <div className="flex gap-3 mb-6 flex-wrap">
        <Input placeholder="Tìm kiếm sản phẩm..." prefix={<SearchOutlined />}
          value={searchText} onChange={e => setSearchText(e.target.value)}
          className="rounded-lg flex-1 min-w-[180px]" style={{ height: 40 }} />
        <Select value={sortBy} onChange={setSortBy} style={{ width: 190, height: 40 }}
          options={[
            { label: "Mới nhất", value: "newest" },
            { label: "Giá thấp → cao", value: "price-asc" },
            { label: "Giá cao → thấp", value: "price-desc" },
            { label: "Bán chạy nhất", value: "best-seller" },
          ]} />
        <Button icon={<FilterOutlined />} onClick={() => setDrawerOpen(true)} className="lg:hidden" style={{ height: 40 }}>Lọc</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="hidden lg:block">
          <div className="bg-white rounded-2xl p-5 shadow-sm sticky top-20">
            <h3 className="font-bold text-gray-900 mb-4">Bộ lọc</h3>
            <FilterContent />
          </div>
        </div>

        <div className="lg:col-span-3">
          <p className="mb-4 text-sm text-gray-500">
            Tổng <span className="font-semibold text-red-600">{totalItems}</span> sản phẩm
            {" "}— trang <span className="font-semibold">{currentPage}</span>/{totalPages}
          </p>

          {loading ? (
            <div className="flex justify-center py-20">
              <Spin indicator={<LoadingOutlined style={{ fontSize: 36 }} />} />
            </div>
          ) : sorted.length === 0 ? (
            <Empty description="Không tìm thấy sản phẩm phù hợp" className="py-16" />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {sorted.map(p => <ProductCard key={p._id} product={p} onViewDetail={onViewDetail} />)}
            </div>
          )}

          {totalPages > 1 && !loading && (
            <div className="flex items-center justify-center gap-2 mt-8 flex-wrap">
              <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}
                className="w-9 h-9 rounded-lg border bg-white flex items-center justify-center disabled:opacity-30 hover:border-red-400 hover:text-red-500 transition-all">
                <LeftOutlined style={{ fontSize: 11 }} />
              </button>
              {pageButtons().map((item, i) =>
                item === "..." ? (
                  <span key={`e${i}`} className="px-1 text-gray-400 text-sm">...</span>
                ) : (
                  <button key={item} onClick={() => goToPage(item)}
                    className={`w-9 h-9 rounded-lg border text-sm font-semibold transition-all ${currentPage === item ? "bg-red-500 text-white border-red-500 shadow" : "bg-white text-gray-700 border-gray-200 hover:border-red-400 hover:text-red-500"}`}>
                    {item}
                  </button>
                )
              )}
              <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}
                className="w-9 h-9 rounded-lg border bg-white flex items-center justify-center disabled:opacity-30 hover:border-red-400 hover:text-red-500 transition-all">
                <RightOutlined style={{ fontSize: 11 }} />
              </button>
            </div>
          )}
        </div>
      </div>

      <Drawer title="Bộ lọc" onClose={() => setDrawerOpen(false)} open={drawerOpen} placement="left">
        <FilterContent />
      </Drawer>
    </section>
  );
};

/* ═══ HomePage ═══ */
const HomePage = () => {
  const navigate = useNavigate();
  const goDetail = (id) => navigate(`/products/${id}`);

  return (
    <div className="bg-slate-50 min-h-screen w-full overflow-x-hidden">
      <main className="max-w-[1500px] mx-auto w-full pl-12 pr-4 sm:pl-14 sm:pr-8 lg:pl-20 lg:pr-16 xl:pl-24 xl:pr-20 py-8">

        {/* Hero Banner */}
        <section className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch mb-10">
          <div className="xl:col-span-8 relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-gray-900 to-red-950 text-white shadow-2xl min-h-[220px]">
            <div className="absolute inset-0 opacity-25 pointer-events-none">
              <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-red-500 blur-3xl" />
              <div className="absolute -bottom-24 -left-16 w-72 h-72 rounded-full bg-orange-500 blur-3xl" />
            </div>
            <div className="relative px-8 py-12 sm:px-10 sm:py-14">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs text-white/90 mb-4 backdrop-blur">
                <FireOutlined /> Khuyến mãi cực sốc hôm nay
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight mb-3">
                Thế Hệ Laptop{" "}
                <span className="bg-gradient-to-r from-red-400 via-amber-300 to-yellow-200 bg-clip-text text-transparent">
                  Mới Nhất 2026
                </span>
              </h1>
              <p className="text-sm text-slate-300 mb-6 max-w-lg">
                Trải nghiệm sức mạnh đột phá từ chip M4 và Intel Core Ultra, thiết kế mỏng nhẹ, hiệu năng vượt trội.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button type="primary" danger size="large" className="rounded-full px-7 h-11 font-semibold">Khám phá ngay</Button>
                <Button size="large" className="rounded-full px-7 h-11 font-semibold border-white/20 text-white bg-white/10">Xem ưu đãi</Button>
              </div>
            </div>
          </div>

          <div className="xl:col-span-4 grid grid-cols-1 gap-4">
            {[
              { title: "Flash Sale Giảm 50%", icon: <TagOutlined />, color: "from-orange-400 to-red-500" },
              { title: "Quà Tặng Công Nghệ", icon: <FireOutlined />, color: "from-blue-400 to-indigo-500" },
              { title: "Giao Nhanh 2H", icon: <ShoppingCartOutlined />, color: "from-green-400 to-teal-500" },
            ].map((promo, i) => (
              <div key={i} className={`rounded-2xl p-[1px] shadow-lg bg-gradient-to-r ${promo.color}`}>
                <div className="bg-white rounded-2xl p-4 flex items-center gap-4">
                  <div className="text-2xl p-3 rounded-xl bg-gray-50 text-gray-700">{promo.icon}</div>
                  <div className="font-semibold text-gray-800 text-sm">{promo.title}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Top 10 */}
        <div className="flex items-center gap-3 mb-8">
          <FireOutlined className="text-red-500 text-xl" />
          <h2 className="text-xl font-bold text-gray-900">Top 10 Nổi Bật</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-red-200 to-transparent" />
        </div>
        <TopProductsSection onViewDetail={goDetail} />

        {/* Tất cả sản phẩm */}
        <div className="flex items-center gap-3 mb-8 mt-4">
          <AppstoreOutlined className="text-red-500 text-xl" />
          <h2 className="text-xl font-bold text-gray-900">Khám Phá Sản Phẩm</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-red-200 to-transparent" />
        </div>
        <AllProductsSection onViewDetail={goDetail} />

      </main>
    </div>
  );
};

export default HomePage;