// src/Customer/pages/Account/AccountPage.test.js
import { render, screen, fireEvent } from "@testing-library/react";
import AccountPage from "./AccountPage";

// Test: click "Tiếp tục mua sắm" thì đổi location.href thành "/product"
test('click "Tiếp tục mua sắm" sẽ điều hướng sang /product', () => {
  // Mock window.location để cho phép sửa href
  const originalLocation = window.location;

  Object.defineProperty(window, "location", {
    writable: true,
    value: { ...originalLocation, href: "http://localhost/account" },
  });

  // Render trang Account
  render(<AccountPage />);

  // Lấy button theo text
  const button = screen.getByRole("button", { name: /Tiếp tục mua sắm/i });

  // Click
  fireEvent.click(button);

  // Kiểm tra đã đổi sang /product
  expect(window.location.href).toBe("/product");

  // Khôi phục location gốc cho các test khác
  window.location = originalLocation;
});
