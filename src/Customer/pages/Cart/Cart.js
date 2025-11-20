// src/components/ShoppingCart.jsx
import React, { useState } from 'react';
import { Trash2, Plus, Minus, ShoppingBag, Tag, ArrowRight } from 'lucide-react';
import './Cart.css';

const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Áo Thun Premium',
      price: 299000,
      quantity: 2,
      image:
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop',
      color: 'Trắng',
      size: 'L',
    },
    {
      id: 2,
      name: 'Quần Jeans Slim Fit',
      price: 599000,
      quantity: 1,
      image:
        'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=200&fit=crop',
      color: 'Xanh đậm',
      size: 'M',
    },
    {
      id: 3,
      name: 'Giày Sneaker Urban',
      price: 899000,
      quantity: 1,
      image:
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200&h=200&fit=crop',
      color: 'Đen',
      size: '42',
    },
  ]);

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const updateQuantity = (id, change) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item,
      ),
    );
  };

  const removeItem = (id) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === 'SAVE20') {
      setAppliedCoupon({ code: 'SAVE20', discount: 0.2 });
    } else if (couponCode.toUpperCase() === 'WELCOME10') {
      setAppliedCoupon({ code: 'WELCOME10', discount: 0.1 });
    } else {
      alert('Mã giảm giá không hợp lệ!');
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const discount = appliedCoupon ? subtotal * appliedCoupon.discount : 0;
  const shipping = subtotal > 500000 ? 0 : 30000;
  const total = subtotal - discount + shipping;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <div className="shopping-cart-page">
      <div className="shopping-cart-container">
        {/* Header */}
        <div className="shopping-cart-header">
          <h1 className="shopping-cart-title">
            <ShoppingBag className="shopping-cart-title-icon" size={40} />
            Giỏ Hàng Của Bạn
          </h1>
          <p className="shopping-cart-subtitle">
            Bạn có {cartItems.length} sản phẩm trong giỏ hàng
          </p>
        </div>

        <div className="shopping-cart-grid">
          {/* Cart Items */}
          <div className="shopping-cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item-card">
                <div className="cart-item-inner">
                  {/* Product Image */}
                  <div className="cart-item-image-wrapper">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="cart-item-image"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="cart-item-content">
                    <div className="cart-item-header">
                      <div>
                        <h3 className="cart-item-name">{item.name}</h3>
                        <div className="cart-item-variants">
                          <span>Màu: {item.color}</span>
                          <span>Size: {item.size}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="cart-item-remove-btn"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>

                    <div className="cart-item-bottom">
                      {/* Quantity Controls */}
                      <div className="cart-item-quantity-wrapper">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="quantity-btn"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="quantity-value">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="quantity-btn"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="cart-item-price">
                        <p className="cart-item-price-total">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                        <p className="cart-item-price-unit">
                          {formatPrice(item.price)} / sản phẩm
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {cartItems.length === 0 && (
              <p className="empty-cart-text">Giỏ hàng của bạn đang trống.</p>
            )}
          </div>

          {/* Order Summary */}
          <div className="shopping-cart-summary-wrapper">
            <div className="shopping-cart-summary">
              <h2 className="summary-title">Tổng Đơn Hàng</h2>

              {/* Coupon */}
              <div className="summary-section">
                <label className="summary-label">Mã giảm giá</label>
                <div className="summary-coupon-row">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Nhập mã giảm giá"
                    className="summary-coupon-input"
                  />
                  <button
                    onClick={applyCoupon}
                    className="summary-coupon-btn"
                  >
                    <Tag size={18} />
                    Áp dụng
                  </button>
                </div>
                {appliedCoupon && (
                  <div className="summary-coupon-applied">
                    <Tag size={16} />
                    Đã áp dụng mã {appliedCoupon.code}
                  </div>
                )}
                <p className="summary-coupon-hint">
                  Thử: SAVE20 hoặc WELCOME10
                </p>
              </div>

              {/* Price Breakdown */}
              <div className="summary-breakdown">
                <div className="summary-row">
                  <span>Tạm tính</span>
                  <span className="summary-value">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="summary-row summary-row-discount">
                    <span>Giảm giá</span>
                    <span className="summary-value">
                      -{formatPrice(discount)}
                    </span>
                  </div>
                )}
                <div className="summary-row">
                  <span>Phí vận chuyển</span>
                  <span className="summary-value">
                    {shipping === 0 ? 'Miễn phí' : formatPrice(shipping)}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="summary-shipping-note">
                    Miễn phí vận chuyển cho đơn hàng trên 500.000đ
                  </p>
                )}
              </div>

              {/* Total */}
              <div className="summary-total-row">
                <span className="summary-total-label">Tổng cộng</span>
                <span className="summary-total-value">
                  {formatPrice(total)}
                </span>
              </div>

              {/* Checkout Button */}
              <button className="summary-checkout-btn">
                Thanh Toán
                <ArrowRight size={20} />
              </button>

              {/* Payment Methods */}
              <div className="summary-payment">
                <p className="summary-payment-text">
                  Chúng tôi chấp nhận:
                </p>
                <div className="summary-payment-icons">
                  {['💳', '🏦', '📱', '💰'].map((emoji, i) => (
                    <div key={i} className="payment-icon">
                      {emoji}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* end summary */}
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
