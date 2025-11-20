// src/utils/authCustomer.js

// Lấy thông tin user từ localStorage
export const getCustomerInfo = () => {
  if (typeof window === "undefined") return null;

  try {
    const userStr =
      localStorage.getItem("customerInfo") ||
      localStorage.getItem("user");

    if (!userStr) return null;
    return JSON.parse(userStr);
  } catch (e) {
    console.error("getCustomerInfo parse error:", e);
    return null;
  }
};

// Kiểm tra đã đăng nhập chưa
export const isCustomerLoggedIn = () => {
  if (typeof window === "undefined") return false;

  const token =
    localStorage.getItem("customerToken") ||
    localStorage.getItem("token");

  const user = getCustomerInfo();

  return !!(token || user);
};
