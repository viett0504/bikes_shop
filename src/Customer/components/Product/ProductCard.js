// src/Customer/components/Product/ProductCard.js
import React from 'react';
import { Heart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import './ProductCard.css';
import { isCustomerLoggedIn } from '../../../utils/authCustomer';
import { useCart } from '../../../utils/cart';
import { useNotification } from '../Noti/notification';

const ProductCard = ({ product, formatPrice }) => {
  const { id, image, name, brand, price, rating = 4.5, reviews = 0 } = product;

  const { addToCart } = useCart();
  const { showNotification } = useNotification();

  // ---- Gửi log thêm vào giỏ ----
  const logAddToCart = async () => {
    try {
      await fetch("/logs/activity/add-to-cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: id,
          productName: name,
          quantity: 1,
        }),
      });
    } catch (err) {
      console.error("Lỗi log add-to-cart:", err);
    }
  };

  const handleOpenDetail = (e) => {
    if (!isCustomerLoggedIn()) {
      e.preventDefault();
      showNotification(
        "Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.",
        "warning",
        { title: "Yêu cầu đăng nhập" }
      );
    }
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (!isCustomerLoggedIn()) {
      showNotification(
        "Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.",
        "warning",
        { title: "Yêu cầu đăng nhập" }
      );
      return;
    }

    addToCart(product, 1);

    showNotification(
      "Đã thêm sản phẩm vào giỏ hàng!",
      "success",
      { title: "Thành công" }
    );

    // → ghi log
    await logAddToCart();
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (!isCustomerLoggedIn()) {
      showNotification(
        "Bạn cần đăng nhập để dùng wishlist.",
        "warning",
        { title: "Yêu cầu đăng nhập" }
      );
      return;
    }

    showNotification(
      "Đã thêm vào wishlist!",
      "success",
      { title: "Thêm vào wishlist" }
    );
  };

  return (
    <div className="product-card group">
      <Link
        to={`/productDetail/${id}`}
        className="block"
        onClick={handleOpenDetail}
      >
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

            <button className="add-cart-btn" onClick={handleAddToCart}>
              Thêm vào giỏ
            </button>
          </div>

          <button className="wishlist-btn" onClick={handleWishlist}>
            <Heart className="w-5 h-5 text-gray-600 hover:text-red-500" />
          </button>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
