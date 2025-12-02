// src/Customer/pages/Products/ProductDetailPage.js
import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
  ShoppingCart,
  Heart,
  Share2,
  Star,
  ChevronLeft,
  ChevronRight,
  Truck,
  Shield,
  RotateCcw,
} from 'lucide-react';
import { getSingleProduct } from '../../components/Product/fetchApi';
import { isCustomerLoggedIn } from '../../../utils/authCustomer';
import { useCart } from '../../../utils/cart';

import './ProductDetailPage.css';

const formatPrice = (price) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price || 0);

export default function ProductDetailPage() {
  const { id } = useParams();

  // ----- state -----
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('black');
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();

  // ----- check login -----
  const isLoggedIn = isCustomerLoggedIn();

  const getImageSrc = (img) => {
    if (!img) return 'https://placehold.co/800x600?text=No+Image';

    if (img.startsWith('http')) {
      const idx = img.indexOf('filebase.io/ipfs/');
      if (idx !== -1) {
        const cid = img.substring(idx + 'filebase.io/ipfs/'.length);
        return `https://ipfs.filebase.io/ipfs/${cid}`;
      }
      return img;
    }

    if (img.startsWith('Qm')) {
      return `https://ipfs.filebase.io/ipfs/${img}`;
    }

    return img;
  };

  // ----- fetch product -----
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const p = await getSingleProduct(id);
        setProduct(p);
      } catch (err) {
        console.error('Error fetching product detail:', err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (!id || !isLoggedIn) return;
    fetchDetail();
  }, [id, isLoggedIn]);

  // ----- images -----
  const images = useMemo(() => {
    if (!product || !product.pImages || !product.pImages.length) {
      return ['https://placehold.co/800x600?text=No+Image'];
    }
    return product.pImages.map((img) => getImageSrc(img));
  }, [product]);

  // ----- calc rating & price -----
  const reviews = product?.pRatingsReviews || [];
  const totalRating = reviews.reduce(
    (sum, r) => sum + Number(r.rating || 0),
    0
  );
  const avgRating = reviews.length
    ? (totalRating / reviews.length).toFixed(1)
    : null;

  const price = product?.pPrice || 0;
  const offer = Number(product?.pOffer || 0);
  const finalPrice = offer ? Math.round((price * (100 - offer)) / 100) : price;
  const inStock = (product?.pQuantity || 0) > 0;

  const colors = [
    { name: 'black', label: 'Đen', code: '#000000' },
    { name: 'red', label: 'Đỏ', code: '#DC2626' },
    { name: 'blue', label: 'Xanh', code: '#2563EB' },
  ];
  const sizes = ['S', 'M', 'L', 'XL'];

  const nextImage = () =>
    setSelectedImage((prev) => (prev + 1) % images.length);
  const prevImage = () =>
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);

  const handleAddToCartDetail = () => {
    if (!isLoggedIn) {
      alert('Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.');
      return;
    }

    if (!product) return;

    const cardProduct = {
      id: product._id,
      name: product.pName,
      brand: product.pCategory?.cName || 'Không rõ',
      price: finalPrice,
      image: images[0],
    };

    addToCart(cardProduct, quantity, {
      selectedColor,
      selectedSize,
    });

    alert('Đã thêm sản phẩm vào giỏ hàng!');
  };

  // ================== RETURN ==================

  // 1) Chưa đăng nhập 
  if (!isLoggedIn) {
    return (
      <div className="product-page">
        <main className="main-container">
          <div style={{ textAlign: 'center', marginTop: '4rem' }}>
            <h2>Bạn cần đăng nhập để xem chi tiết sản phẩm.</h2>
          </div>
        </main>
      </div>
    );
  }

  // 2) Đang tải
  if (loading) {
    return (
      <div className="product-page">
        <main className="main-container">
          <div>Đang tải thông tin sản phẩm...</div>
        </main>
      </div>
    );
  }

  // 3) Không tìm thấy
  if (!product) {
    return (
      <div className="product-page">
        <main className="main-container">
          <div>Không tìm thấy sản phẩm.</div>
        </main>
      </div>
    );
  }

  // 4) Đã login + có sản phẩm → render chi tiết
  return (
    <div className="product-page">
      <main className="main-container">
        <div className="product-grid-detail">
          {/* Gallery */}
          <div className="gallery">
            <div className="gallery-main">
              <img
                src={images[selectedImage]}
                alt={product.pName}
                className="gallery-image"
              />
              <button onClick={prevImage} className="gallery-btn left">
                <ChevronLeft size={24} />
              </button>
              <button onClick={nextImage} className="gallery-btn right">
                <ChevronRight size={24} />
              </button>
              <button className="gallery-fav">
                <Heart size={24} className="heart-icon" />
              </button>
            </div>

            <div className="gallery-thumbs">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`thumb ${
                    selectedImage === idx ? 'active' : ''
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} />
                </button>
              ))}
            </div>

            <div className="features">
              <div className="feature-item">
                <Truck size={32} />
                <span>Miễn phí vận chuyển</span>
              </div>
              <div className="feature-item">
                <Shield size={32} />
                <span>Bảo hành 24 tháng</span>
              </div>
              <div className="feature-item">
                <RotateCcw size={32} />
                <span>Đổi trả 7 ngày</span>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="product-info">
            <div className="product-status">
              <span className={inStock ? 'in-stock' : ''}>
                {inStock ? 'Còn hàng' : 'Hết hàng'}
              </span>
              <span className="new">{product.pStatus}</span>
            </div>

            <h1 className="product-title">{product.pName}</h1>

            <div className="product-rating">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  className="star"
                  style={{
                    color:
                      avgRating && i < Math.round(avgRating)
                        ? '#facc15'
                        : '#e5e7eb',
                  }}
                />
              ))}
              {avgRating ? (
                <span>
                  {avgRating} / 5 ({reviews.length} đánh giá)
                </span>
              ) : (
                <span>(Chưa có đánh giá)</span>
              )}
            </div>

            <div className="product-prices">
              <span className="price-current">
                {formatPrice(finalPrice)}
              </span>
              {offer ? (
                <>
                  <span className="price-old">
                    {formatPrice(price)}
                  </span>
                  <span className="price-discount">-{offer}%</span>
                </>
              ) : null}
            </div>

            <p className="product-desc">{product.pDescription}</p>

            {/* Color */}
            <div className="option-section">
              <label>
                Màu sắc:{' '}
                <span>
                  {
                    colors.find((c) => c.name === selectedColor)
                      ?.label
                  }
                </span>
              </label>
              <div className="color-options">
                {colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`color-circle ${
                      selectedColor === color.name ? 'selected' : ''
                    }`}
                    style={{ backgroundColor: color.code }}
                    title={color.label}
                  />
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="option-section">
              <label>
                Kích thước: <span>{selectedSize}</span>
              </label>
              <div className="size-options">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`size-btn ${
                      selectedSize === size ? 'selected' : ''
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="option-section">
              <label>Số lượng:</label>
              <div className="quantity">
                <button
                  onClick={() =>
                    setQuantity((q) => Math.max(1, q - 1))
                  }
                >
                  -
                </button>
                <span>{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  disabled={!inStock}
                >
                  +
                </button>
                <span className="stock">
                  Còn {product.pQuantity ?? 0} sản phẩm
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="actions">
              <button
                className="add-cart"
                onClick={handleAddToCartDetail}
              >
                <ShoppingCart size={20} /> Thêm vào giỏ hàng
              </button>
              <button className="share">
                <Share2 size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Specs */}
        <div className="specs">
          <h2>Thông số sản phẩm</h2>
          <div className="specs-grid">
            <div className="specs-col">
              <div>
                <span>Thương hiệu</span>
                <span>{product.pCategory?.cName || 'Không rõ'}</span>
              </div>
              <div>
                <span>Loại xe</span>
                <span>{product.pBiketype?.tName || 'Không rõ'}</span>
              </div>
              <div>
                <span>Giá gốc</span>
                <span>{formatPrice(price)}</span>
              </div>
              <div>
                <span>Giảm giá</span>
                <span>{offer ? `${offer}%` : 'Không'}</span>
              </div>
            </div>
            <div className="specs-col">
              <div>
                <span>Giá sau giảm</span>
                <span>{formatPrice(finalPrice)}</span>
              </div>
              <div>
                <span>Tồn kho</span>
                <span>{product.pQuantity ?? 0}</span>
              </div>
              <div>
                <span>Đã bán</span>
                <span>{product.pSold ?? 0}</span>
              </div>
              <div>
                <span>Trạng thái</span>
                <span>{product.pStatus}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
