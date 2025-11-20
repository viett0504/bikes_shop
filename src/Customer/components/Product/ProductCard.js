// ./Customer/components/Product/ProductCard.js
import React from 'react';
import { Heart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product, formatPrice }) => {
  const {
    id,
    image,
    name,
    brand,
    price,
    rating = 4.5,
    reviews = 0,
  } = product;

  return (
    <div className="product-card group">
      {/* Link mang theo id để DetailPage đọc */}
      <Link to={`/productDetail/${id}`} className="block">
        <div className="product-image-container">
          <img
            src={image}
            alt={name}
            className="product-image group-hover:scale-110"
          />
        </div>
        <div className="product-info">
          <div className="product-name">{name}</div>

          <div className="product-brand">{brand}</div>

          <div className="product-rating">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="rating-value">{rating}</span>
            <span className="rating-count">({reviews})</span>
          </div>

          <div className="product-bottom">
            <span className="product-price">{formatPrice(price)}</span>
            <button
              className="add-cart-btn"
              onClick={(e) => {
                e.stopPropagation();
                console.log('Thêm vào giỏ:', name);
              }}
            >
              Thêm vào giỏ
            </button>
          </div>

          <button
            className="wishlist-btn"
            onClick={(e) => {
              e.stopPropagation();
              console.log('Đã thêm vào wishlist:', name);
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
