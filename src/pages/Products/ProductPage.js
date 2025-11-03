// src/pages/ProductPage.jsx
import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import ProductCard from '../../components/Product/ProductCard';
import './ProductPage.css';

const ProductPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 50000000]);
  const [sortBy, setSortBy] = useState('featured');

  const products = [
    { id: 1, name: 'Giant TCR Advanced Pro', category: 'road', brand: 'Giant', price: 45000000, image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=500', rating: 4.8, reviews: 124 },
    { id: 2, name: 'Trek Marlin 7', category: 'mountain', brand: 'Trek', price: 18500000, image: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=500', rating: 4.6, reviews: 89 },
    { id: 3, name: 'Specialized Tarmac SL7', category: 'road', brand: 'Specialized', price: 52000000, image: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=500', rating: 4.9, reviews: 156 },
    { id: 4, name: 'Cannondale Trail 5', category: 'mountain', brand: 'Cannondale', price: 15000000, image: 'https://images.unsplash.com/photo-1511994298241-608e28f14fde?w=500', rating: 4.5, reviews: 67 },
    { id: 5, name: 'Trek Domane SL5', category: 'road', brand: 'Trek', price: 38000000, image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=500', rating: 4.7, reviews: 102 },
    { id: 6, name: 'Giant Escape 3', category: 'city', brand: 'Giant', price: 8500000, image: 'https://images.unsplash.com/photo-1505705694536-f9e9b2c98f5c?w=500', rating: 4.4, reviews: 145 },
    { id: 7, name: 'Specialized Rockhopper', category: 'mountain', brand: 'Specialized', price: 12000000, image: 'https://images.unsplash.com/photo-1559589689-577aabd1db4f?w=500', rating: 4.6, reviews: 78 },
    { id: 8, name: 'Cannondale Quick 4', category: 'city', brand: 'Cannondale', price: 9500000, image: 'https://images.unsplash.com/photo-1557767940-fe0b85d4c1f3?w=500', rating: 4.3, reviews: 92 },
  ];

  const filteredProducts = products.filter(product => {
    if (selectedCategory !== 'all' && product.category !== selectedCategory) return false;
    if (selectedBrand !== 'all' && product.brand !== selectedBrand) return false;
    if (product.price < priceRange[0] || product.price > priceRange[1]) return false;
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'rating': return b.rating - a.rating;
      default: return 0;
    }
  });

  const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  return (
    <div className="product-page-container">
      <div className="product-content-wrapper">
        {/* Sidebar */}
        <aside className= "sidebar" >
          <div className="filter-box">
            <h2 className="filter-title">
              <Filter className="icon" /> Bộ Lọc
            </h2>

            {/* Category */}
            <div className="filter-section">
              <h3>Loại Xe</h3>
              {['all', 'road', 'mountain', 'city'].map(cat => (
                <label key={cat}>
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === cat}
                    onChange={() => setSelectedCategory(cat)}
                  />
                  {cat === 'all' ? 'Tất cả' : cat === 'road' ? 'Xe đua' : cat === 'mountain' ? 'Xe địa hình' : 'Xe đạp phố'}
                </label>
              ))}
            </div>

            {/* Brand */}
            <div className="filter-section">
              <h3>Thương Hiệu</h3>
              {['all', 'Giant', 'Trek', 'Specialized', 'Cannondale'].map(brand => (
                <label key={brand}>
                  <input
                    type="radio"
                    checked={selectedBrand === brand}
                    onChange={() => setSelectedBrand(brand)}
                  /> 
                  {brand}
                </label>
              ))}
            </div>

            {/* Price */}
            <div className="filter-section">
              <h3>Khoảng Giá</h3>
              <input
                type="range"
                min="0"
                max="50000000"
                step="1000000"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
              />
              <div className="price-display">
                <span>0đ</span>
                <span>{formatPrice(priceRange[1])}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-section">
          <div className="toolbar">
            <div className="sort-section">
              <span>{sortedProducts.length} sản phẩm</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="featured">Nổi bật</option>
                <option value="price-low">Giá: Thấp đến Cao</option>
                <option value="price-high">Giá: Cao đến Thấp</option>
                <option value="rating">Đánh giá cao nhất</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          <div className="product-grid">
            {sortedProducts.length > 0 ? (
              sortedProducts.map((p) => (
                <ProductCard key={p.id} product={p} formatPrice={formatPrice} />
              ))
            ) : (
              <p className="no-result">Không tìm thấy sản phẩm phù hợp</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProductPage;
