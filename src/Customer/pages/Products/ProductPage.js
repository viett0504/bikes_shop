// src/pages/Products/ProductPage.js
import React, { useState, useMemo, useEffect } from 'react';
import { Filter } from 'lucide-react';
import ProductCard from '../../components/Product/ProductCard';
import './ProductPage.css';

const ProductPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [selectedBrand, setSelectedBrand] = useState('Tất cả');
  const [priceRange, setPriceRange] = useState([0, 50000000]);
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);

  // ===================== FAKE DATA 105 sản phẩm =====================
  const products = useMemo(() => {
    const base = [...Array(21)].map((_, i) => ({
      id: i + 1,
      name: `Xe mẫu ${i + 1}`,
      category: ['road', 'mountain', 'city'][i % 3],
      brand: ['Giant', 'Trek', 'Specialized', 'Cannondale'][i % 4],
      price: 8000000 + (i % 10) * 2000000,
      rating: 4.2 + (i % 3) * 0.2,
      reviews: 40 + (i % 15) * 3,
      image: 'https://images.unsplash.com/photo-1518655048521-f130df041f66?w=500',
    }));

    const all = [];
    for (let i = 0; i < 5; i++) {
      base.forEach((item) => {
        all.push({ ...item, id: all.length + 1 });
      });
    }

    return all; // 105 sản phẩm
  }, []);

  // ===================== FILTER =====================
  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== 'Tất cả' && p.category !== selectedCategory) return false;
    if (selectedBrand !== 'Tất cả' && p.brand !== selectedBrand) return false;
    if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
    return true;
  });

  // ===================== SORT =====================
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'rating': return b.rating - a.rating;
      default: return 0;
    }
  });

  // ===================== PAGINATION =====================
  const pageSize = 21;
  const totalPages = Math.ceil(sortedProducts.length / pageSize) || 1;

  // Fix lỗi setState trong render
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [totalPages]);

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + pageSize);

  // Tạo range phân trang dạng chuyên nghiệp
  const pageRange = useMemo(() => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    const current = currentPage;
    const first = 1;
    const last = totalPages;

    pages.push(first);

    let left = current - 1;
    let right = current + 1;

    if (left <= 2) {
      left = 2;
      right = 4;
    }
    if (right >= last - 1) {
      right = last - 1;
      left = last - 3;
    }

    if (left > 2) pages.push("...");
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < last - 1) pages.push("...");

    pages.push(last);
    return pages;
  }, [currentPage, totalPages]);

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

  return (
    <div className="product-page-container">
      <div className="product-content-wrapper">
        
        {/* ========== SIDEBAR ========== */}
        <div className="filter-box">
          <h2 className="filter-title">
            <Filter className="icon" /> Bộ Lọc
          </h2>

          {/* Category */}
          <div className="filter-section">
            <h3>Loại xe</h3>
            {['Tất cả', 'road', 'mountain', 'city'].map((cat) => (
              <label key={cat}>
                <input type="radio" checked={selectedCategory === cat} onChange={() => { setSelectedCategory(cat); setCurrentPage(1); }} />
                {cat}
              </label>
            ))}
          </div>

          {/* Brand */}
          <div className="filter-section">
            <h3>Thương hiệu</h3>
            {['Tất cả', 'Giant', 'Trek', 'Specialized', 'Cannondale'].map((b) => (
              <label key={b}>
                <input type="radio" checked={selectedBrand === b} onChange={() => { setSelectedBrand(b); setCurrentPage(1); }} />
                {b}
              </label>
            ))}
          </div>

        </div>

        {/* ========== MAIN CONTENT ========== */}
        <main className="main-section">

          {/* ===== Toolbar chuyên nghiệp ===== */}
          <div className="toolbar">
            <div className="sort-section">
              <span>Hiển thị {paginatedProducts.length}/{filteredProducts.length} sản phẩm</span>
              <select value={sortBy} onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}>
                <option value="featured">Nổi bật</option>
                <option value="price-low">Giá thấp → cao</option>
                <option value="price-high">Giá cao → thấp</option>
                <option value="rating">Đánh giá cao nhất</option>
              </select>
            </div>

          </div>

          {/* GRID */}
          <div className="product-grid">
            {paginatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} formatPrice={formatPrice} />
            ))}
          </div>

          {/* ===== Pagination dưới: bản đẹp ===== */}
          {totalPages > 1 && (
            <div className="pagination">
              <button className="page-nav" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>«</button>

              {pageRange.map((pg, idx) =>
                pg === "..." ? (
                  <span key={idx} className="page-ellipsis">…</span>
                ) : (
                  <button key={pg} className={`page-btn ${pg === currentPage ? "active" : ""}`} onClick={() => setCurrentPage(pg)}>
                    {pg}
                  </button>
                )
              )}

              <button className="page-nav" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>»</button>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default ProductPage;
