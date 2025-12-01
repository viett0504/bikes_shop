// src/Customer/components/Cart/Cart.js
import React, { useState } from 'react';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Tag,
  ArrowRight,
} from 'lucide-react';
import './Cart.css';
import axios from 'axios';
import { useCart } from '../../../utils/cart';
import { useNavigate } from "react-router-dom";

import { getCustomerInfo, isCustomerLoggedIn } from '../../../utils/authCustomer';
import { useNotification } from "../../components/Noti/notification";

const apiURL = process.env.REACT_APP_API_URL;

const ShoppingCart = () => {
  const { items, updateQuantity, removeItem, clearCart, subtotal } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const navigate = useNavigate();

  const { showNotification } = useNotification(); // ✅ THÊM

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === 'SAVE20') {
      setAppliedCoupon({ code: 'SAVE20', discount: 0.2 });
      showNotification('Đã áp dụng mã SAVE20 (giảm 20%)', 'success', {
        title: 'Mã giảm giá',
      });
    } else if (couponCode.toUpperCase() === 'WELCOME10') {
      setAppliedCoupon({ code: 'WELCOME10', discount: 0.1 });
      showNotification('Đã áp dụng mã WELCOME10 (giảm 10%)', 'success', {
        title: 'Mã giảm giá',
      });
    } else {
      showNotification('Mã giảm giá không hợp lệ!', 'warning', {
        title: 'Mã không hợp lệ',
      });
      setAppliedCoupon(null);
    }
  };

  const discount = appliedCoupon ? subtotal * appliedCoupon.discount : 0;
  const shipping = subtotal > 500000 ? 0 : 30000;
  const total = subtotal - discount + shipping;

  const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price || 0);

  const handleCheckout = async () => {
    if (!isCustomerLoggedIn()) {
      showNotification('Bạn cần đăng nhập để thanh toán.', 'warning', {
        title: 'Yêu cầu đăng nhập',
      });
      return;
    }

    if (!items.length) {
      showNotification('Giỏ hàng của bạn đang trống.', 'info', {
        title: 'Giỏ hàng trống',
      });
      return;
    }

    if (!address || !phone) {
      showNotification(
        'Vui lòng nhập đầy đủ địa chỉ và số điện thoại.',
        'warning',
        { title: 'Thiếu thông tin giao hàng' }
      );
      return;
    }

    const user = getCustomerInfo();
    if (!user?._id) {
      showNotification('Không tìm thấy thông tin người dùng.', 'error', {
        title: 'Lỗi tài khoản',
      });
      return;
    }

    const payload = {
      allProduct: items.map((item) => ({
        id: item.productId,
        quantitiy: item.quantity,
      })),
      user: user._id,
      amount: total,
      transactionId: `COD-${Date.now()}`,
      address,
      phone,
      payStatus: "Chưa thanh toán",
      payMethod: "Thanh toán khi nhận hàng",
    };

    try {
      setLoadingCheckout(true);
      const res = await axios.post(
        `${apiURL}/api/order/create-order`,
        payload
      );

      if (res.data?.success) {
        const createdOrder = res.data.order;

        // ✅ NOTI thành công
        showNotification('Đặt hàng thành công!', 'success', {
          title: 'Thành công',
        });

        // ✅ Ghi log đơn hàng
        fetch(`${apiURL}/logs/activity/orders/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: createdOrder?._id,
            userId: user._id,
            amount: total,
            itemsCount: items.length,
            payStatus: payload.payStatus,
            payMethod: payload.payMethod,
            transactionId: payload.transactionId,
          }),
        }).catch(err =>
          console.error("Log create order error:", err)
        );

        clearCart();

        navigate("/payment", {
          state: {
            orderId: createdOrder?._id,
            total: formatPrice(total),
          }
        });
      } else {
        console.error('create-order response:', res.data);
        const msg =
          res.data?.message || res.data?.error || 'Đặt hàng thất bại';
        showNotification(msg, 'error', {
          title: 'Đặt hàng thất bại',
        });

        // (optional) log lỗi
        fetch(`${apiURL}/logs/activity/orders/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            error: msg,
            userId: user._id,
            amount: total,
            itemsCount: items.length,
            fail: true,
          }),
        }).catch(() => {});
      }
    } catch (err) {
      console.error('create-order error:', err?.response?.data || err);
      showNotification('Có lỗi xảy ra khi tạo đơn hàng.', 'error', {
        title: 'Lỗi hệ thống',
      });

      // (optional) log lỗi
      try {
        const user = getCustomerInfo();
        fetch(`${apiURL}/logs/activity/orders/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            error: 'EXCEPTION_WHEN_CREATE_ORDER',
            detail: err?.response?.data || String(err),
            userId: user?._id,
            amount: total,
            itemsCount: items.length,
            fail: true,
          }),
        }).catch(() => {});
      } catch (_) {}
    } finally {
      setLoadingCheckout(false);
    }
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
            Bạn có {items.length} sản phẩm trong giỏ hàng
          </p>
        </div>

        <div className="shopping-cart-grid">
          {/* Cart Items */}
          <div className="shopping-cart-items">
            {items.map((item, index) => (
              <div key={`${item.productId}-${index}`} className="cart-item-card">
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
                          {item.brand && <span>Thương hiệu: {item.brand}</span>}
                          {item.selectedColor && (
                            <span>Màu: {item.selectedColor}</span>
                          )}
                          {item.selectedSize && (
                            <span>Size: {item.selectedSize}</span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          removeItem(
                            item.productId,
                            item.selectedColor,
                            item.selectedSize
                          )
                        }
                        className="cart-item-remove-btn"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>

                    <div className="cart-item-bottom">
                      {/* Quantity Controls */}
                      <div className="cart-item-quantity-wrapper">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.selectedColor,
                              item.selectedSize,
                              -1
                            )
                          }
                          className="quantity-btn"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="quantity-value">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.selectedColor,
                              item.selectedSize,
                              1
                            )
                          }
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

            {items.length === 0 && (
              <p className="empty-cart-text">Giỏ hàng của bạn đang trống.</p>
            )}
          </div>

          {/* Order Summary */}
          <div className="shopping-cart-summary-wrapper">
            <div className="shopping-cart-summary">
              <h2 className="summary-title">Tổng Đơn Hàng</h2>

              {/* Địa chỉ / Phone */}
              <div className="summary-section">
                <label className="summary-label">Địa chỉ giao hàng</label>
                <input
                  type="text"
                  className="summary-coupon-input"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Nhập địa chỉ"
                />
              </div>

              <div className="summary-section">
                <label className="summary-label">Số điện thoại</label>
                <input
                  type="text"
                  className="summary-coupon-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Nhập số điện thoại"
                />
              </div>

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

              {/* Breakdown */}
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
              <button
                className="summary-checkout-btn"
                onClick={handleCheckout}
                disabled={loadingCheckout || items.length === 0}
              >
                {loadingCheckout ? 'Đang xử lý...' : 'Thanh Toán'}
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
          {/* end summary */}
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
