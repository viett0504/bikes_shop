// src/Customer/context/CartContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();
const CART_KEY = 'bike_cart';

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  // Load từ localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_KEY);
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Load cart error:', e);
    }
  }, []);

  // Lưu vào localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Save cart error:', e);
    }
  }, [items]);

  const addToCart = (product, quantity = 1, options = {}) => {
    setItems((prev) => {
      const idx = prev.findIndex(
        (item) =>
          item.productId === product.id &&
          item.selectedColor === options.selectedColor &&
          item.selectedSize === options.selectedSize
      );

      if (idx !== -1) {
        const clone = [...prev];
        clone[idx] = {
          ...clone[idx],
          quantity: clone[idx].quantity + quantity,
        };
        return clone;
      }

      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          brand: product.brand,
          quantity,
          selectedColor: options.selectedColor || null,
          selectedSize: options.selectedSize || null,
        },
      ];
    });
  };

  const updateQuantity = (productId, selectedColor, selectedSize, change) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (
            item.productId === productId &&
            item.selectedColor === selectedColor &&
            item.selectedSize === selectedSize
          ) {
            const newQty = Math.max(1, item.quantity + change);
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((i) => i.quantity > 0)
    );
  };

  const removeItem = (productId, selectedColor, selectedSize) => {
    setItems((prev) =>
      prev.filter(
        (item) =>
          !(
            item.productId === productId &&
            item.selectedColor === selectedColor &&
            item.selectedSize === selectedSize
          )
      )
    );
  };

  const clearCart = () => setItems([]);

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{ items, addToCart, updateQuantity, removeItem, clearCart, subtotal }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
