import React from 'react';
import { Heart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product, formatPrice }) => {
  return (
    <div className="product-card group">
      {/* Chỉ Link bao quanh ảnh + tên */}
      <Link to={`/productDetail`} className="block">
        <div className="product-image-container">
          <img src={product.image} alt={product.name} className="product-image group-hover:scale-110" />
        </div>
        <div className="product-info">
        <div className="product-name">{product.name}</div>

        <div className="product-brand">{product.brand}</div>

        <div className="product-rating">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="rating-value">{product.rating}</span>
          <span className="rating-count">({product.reviews})</span>
        </div>

        <div className="product-bottom">
          <span className="product-price">{formatPrice(product.price)}</span>
          <button
            className="add-cart-btn"
            onClick={(e) => {
              e.stopPropagation(); // ngăn nổi bọt lên card
              console.log('Thêm vào giỏ:', product.name);
            }}
          >
            Thêm vào giỏ
          </button>
        </div>

        {/* Wishlist vẫn ở ngoài Link */}
        <button
          className="wishlist-btn"
          onClick={(e) => {
            e.stopPropagation();
            console.log('Đã thêm vào wishlist:', product.name);
          }}
        >
          <Heart className="w-5 h-5 text-gray-600 hover:text-red-500" />
        </button>
      </div>
      </Link>

      
    </div>
  );
};

export default ProductCard;
