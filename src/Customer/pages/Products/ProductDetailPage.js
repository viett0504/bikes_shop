// src/pages/Products/ProductDetailPage.js
import React, { useState } from 'react';
import { ShoppingCart, Heart, Share2, Star, ChevronLeft, ChevronRight, Truck, Shield, RotateCcw } from 'lucide-react';
import './ProductDetailPage.css';

export default function ProductDetailPage() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('black');
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);

  const images = [
    'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=800&q=80',
    'https://images.unsplash.com/photo-1571333250630-f0230c320b6d?w=800&q=80',
    'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=800&q=80',
    'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&q=80'
  ];

  const colors = [
    { name: 'black', label: 'Đen', code: '#000000' },
    { name: 'red', label: 'Đỏ', code: '#DC2626' },
    { name: 'blue', label: 'Xanh', code: '#2563EB' }
  ];

  const sizes = ['S', 'M', 'L', 'XL'];

  const nextImage = () => setSelectedImage((prev) => (prev + 1) % images.length);
  const prevImage = () => setSelectedImage((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="product-page">
      {/* Main */}
      <main className="main-container">
        <div className="product-grid">
          {/* Image gallery */}
          <div className="gallery">
            <div className="gallery-main">
              <img src={images[selectedImage]} alt="Xe đạp" className="gallery-image" />
              <button onClick={prevImage} className="gallery-btn left"><ChevronLeft size={24} /></button>
              <button onClick={nextImage} className="gallery-btn right"><ChevronRight size={24} /></button>
              <button className="gallery-fav"><Heart size={24} className="heart-icon" /></button>
            </div>

            <div className="gallery-thumbs">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`thumb ${selectedImage === idx ? 'active' : ''}`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} />
                </button>
              ))}
            </div>  
            {/* Features */}
            <div className="features">
              <div className="feature-item"><Truck size={32} /><span>Miễn phí vận chuyển</span></div>
              <div className="feature-item"><Shield size={32} /><span>Bảo hành 24 tháng</span></div>
              <div className="feature-item"><RotateCcw size={32} /><span>Đổi trả 7 ngày</span></div>
            </div>
          </div>

          {/* Product Info */}
          <div className="product-info">
            <div className="product-status">
              <span className="in-stock">Còn hàng</span>
              <span className="new">Mới nhất</span>
            </div>

            <h1 className="product-title">Xe Đạp Địa Hình Mountain Pro X5</h1>

            <div className="product-rating">
              {[...Array(5)].map((_, i) => <Star key={i} size={20} className="star" />)}
              <span>(128 đánh giá)</span>
            </div>

            <div className="product-prices">
              <span className="price-current">12.990.000₫</span>
              <span className="price-old">15.990.000₫</span>
              <span className="price-discount">-19%</span>
            </div>

            <p className="product-desc">
              Xe đạp địa hình cao cấp với khung nhôm siêu nhẹ, hệ thống phanh đĩa thủy lực và bộ truyền động 21 tốc độ.
              Thiết kế hiện đại, phù hợp cho mọi địa hình từ đường phố đến núi rừng.
            </p>

            {/* Color */}
            <div className="option-section">
              <label>Màu sắc: <span>{colors.find(c => c.name === selectedColor)?.label}</span></label>
              <div className="color-options">
                {colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`color-circle ${selectedColor === color.name ? 'selected' : ''}`}
                    style={{ backgroundColor: color.code }}
                    title={color.label}
                  />
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="option-section">
              <label>Kích thước: <span>{selectedSize}</span></label>
              <div className="size-options">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`size-btn ${selectedSize === size ? 'selected' : ''}`}
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
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
                <span className="stock">Còn 47 sản phẩm</span>
              </div>
            </div>

            {/* Action */}
            <div className="actions">
              <button className="add-cart"><ShoppingCart size={20} /> Thêm vào giỏ hàng</button>
              <button className="share"><Share2 size={20} /></button>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="specs">
          <h2>Thông số kỹ thuật</h2>
          <div className="specs-grid">
            <div className="specs-col">
              <div><span>Khung xe</span><span>Nhôm Alloy 6061</span></div>
              <div><span>Phanh</span><span>Đĩa thủy lực</span></div>
              <div><span>Số tốc độ</span><span>21 tốc độ</span></div>
            </div>
            <div className="specs-col">
              <div><span>Kích thước bánh</span><span>27.5 inch</span></div>
              <div><span>Trọng lượng</span><span>13.5 kg</span></div>
              <div><span>Xuất xứ</span><span>Taiwan</span></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
