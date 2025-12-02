// src/pages/Products/ProductPage.js
import React, { useState, useMemo, useEffect } from 'react';
import { Filter } from 'lucide-react';
import ProductCard from '../../components/Product/ProductCard';
import { getAllProduct } from '../../components/Product/fetchApi';
import { getAllBikeTypes, getAllCategories } from '../../components/Product/fetchApi';

import './ProductPage.css';

const ProductPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('Tất cả'); 
  const [selectedBrand, setSelectedBrand] = useState('Tất cả');       
  const [priceRange, setPriceRange] = useState([0, 500000000]);
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [bikeTypes, setBikeTypes] = useState([]);
  const [brands, setBrands] = useState([]);

  const [products, setProducts] = useState([]);   // data thật từ BE
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Helper convert ảnh IPFS / local giống bên admin
  const getImageSrc = (img) => {
    if (!img) return 'https://placehold.co/400x400?text=No+Image';

    // Link http(s)
    if (img.startsWith('http')) {
      const idx = img.indexOf('filebase.io/ipfs/');
      if (idx !== -1) {
        const cid = img.substring(idx + 'filebase.io/ipfs/'.length);
        return `https://ipfs.filebase.io/ipfs/${cid}`;
      }
      return img;
    }

    // BE chỉ lưu CID (Qmxxxx)
    if (img.startsWith('Qm')) {
      return `https://ipfs.filebase.io/ipfs/${img}`;
    }

    return img;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        const [listProducts, listTypes, listCategories] = await Promise.all([
          getAllProduct(),
          getAllBikeTypes(),
          getAllCategories(),
        ]);

        setProducts(listProducts);
        setBikeTypes(listTypes);
        setBrands(listCategories);
      } catch (err) {
        setError('Không tải được dữ liệu sản phẩm / bộ lọc');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ====== Tạo danh sách filter ======
  const categoryOptions = useMemo(() => {
    const activeTypes = bikeTypes.filter(t => t.tStatus === 'Active');
  const names = activeTypes.map(t => t.tName);

    return ['Tất cả', ...names];
  }, [bikeTypes]);

  // Thương hiệu 
  const brandOptions = useMemo(() => {
    const activeCats = brands.filter(c => c.cStatus === 'Active');
    const names = activeCats.map(c => c.cName);
    return ['Tất cả', ...names];
  }, [brands]);

  // ====== FILTER ======
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const cat = p.pBiketype?.tName || 'Khác';
      const brand = p.pCategory?.cName || 'Khác';
      const price = p.pPrice || 0;

      if (selectedCategory !== 'Tất cả' && cat !== selectedCategory) return false;
      if (selectedBrand !== 'Tất cả' && brand !== selectedBrand) return false;
      if (price < priceRange[0] || price > priceRange[1]) return false;
      return true;
    });
  }, [products, selectedCategory, selectedBrand, priceRange]);

  // ====== SORT ======
  const sortedProducts = useMemo(() => {
    const arr = [...filteredProducts];
    return arr.sort((a, b) => {
      const priceA = a.pPrice || 0;
      const priceB = b.pPrice || 0;
      const ratingA = a.pRatingsReviews?.length ? a.pRatingsReviews.length : 0;
      const ratingB = b.pRatingsReviews?.length ? b.pRatingsReviews.length : 0;

      switch (sortBy) {
        case 'price-low':
          return priceA - priceB;
        case 'price-high':
          return priceB - priceA;
        case 'rating':
          return ratingB - ratingA;
        default:
          return 0;
      }
    });
  }, [filteredProducts, sortBy]);

  // ====== PAGINATION ======
  const pageSize = 18;
  const totalPages = Math.ceil(sortedProducts.length / pageSize) || 1;

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [totalPages, currentPage]);

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + pageSize);

  // Range trang như cũ
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
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price || 0);

  // Map BE -> object cho ProductCard
  const mapToCardProduct = (p) => {
    const price = p.pPrice || 0;
    const offer = Number(p.pOffer || 0);
    const finalPrice = offer ? Math.round(price * (100 - offer) / 100) : price;

    const reviews = p.pRatingsReviews || [];
    const totalRating = reviews.reduce(
      (sum, r) => sum + Number(r.rating || 0),
      0
    );
    const avgRating = reviews.length ? (totalRating / reviews.length).toFixed(1) : 4.5;

    return {
      id: p._id,
      name: p.pName,
      brand: p.pCategory?.cName || "Không rõ",
      price: finalPrice,
      rating: avgRating,
      reviews: reviews.length,
      image: getImageSrc(p.pImages?.[0]),
    };
  };

  return (
    <div className="product-page-container">
      <div className="product-content-wrapper">
        {/* ========== SIDEBAR ========== */}
        <div className="filter-box">
          <h2 className="filter-title">
            <Filter className="icon" /> Bộ Lọc
          </h2>

          {/* Loại xe */}
          <div className="filter-section">
            <h3>Loại xe</h3>
            {categoryOptions.map((cat) => (
              <label key={cat}>
                <input
                  type="radio"
                  checked={selectedCategory === cat}
                  onChange={() => {
                    setSelectedCategory(cat);
                    setCurrentPage(1);
                  }}
                />
                {cat}
              </label>
            ))}
          </div>

          {/* Thương hiệu */}
          <div className="filter-section">
            <h3>Thương hiệu</h3>
            {brandOptions.map((b) => (
              <label key={b}>
                <input
                  type="radio"
                  checked={selectedBrand === b}
                  onChange={() => {
                    setSelectedBrand(b);
                    setCurrentPage(1);
                  }}
                />
                {b}
              </label>
            ))}
          </div>
        </div>

        {/* ========== MAIN CONTENT ========== */}
        <main className="main-section">
          <div className="toolbar">
            <div className="sort-section">
              <span>
                {loading
                  ? "Đang tải sản phẩm..."
                  : `Hiển thị ${paginatedProducts.length}/${filteredProducts.length} sản phẩm`}
              </span>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="featured">Nổi bật</option>
                <option value="price-low">Giá thấp → cao</option>
                <option value="price-high">Giá cao → thấp</option>
                <option value="rating">Đánh giá cao nhất</option>
              </select>
            </div>
          </div>

          {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}

          {/* GRID */}
          <div className="product-grid">
            {!loading && paginatedProducts.length === 0 && (
              <div className="no-result">Không có sản phẩm nào phù hợp.</div>
            )}

            {paginatedProducts.map((p) => (
              <ProductCard
                key={p._id}
                product={mapToCardProduct(p)}
                formatPrice={formatPrice}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="page-nav"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                «
              </button>

              {pageRange.map((pg, idx) =>
                pg === "..." ? (
                  <span key={`ellipsis-${idx}`} className="page-ellipsis">
                    …
                  </span>
                ) : (
                  <button
                    key={`page-${pg}`}
                    className={`page-btn ${pg === currentPage ? "active" : ""}`}
                    onClick={() => setCurrentPage(pg)}
                  >
                    {pg}
                  </button>
                )
              )}

              <button
                className="page-nav"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                »
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductPage;
