// cypress/e2e/login.cy.js

describe("Flow đăng nhập", () => {
  it("đăng nhập bằng tài khoản admin (nam@gmail.com) và chuyển sang /admin", () => {
    cy.visit("http://localhost:3000/login");

    cy.get('input[placeholder="Email"]').type("nam@gmail.com");
    cy.get('input[placeholder="Mật khẩu"]').type("12345678");

    cy.contains("button", /đăng nhập/i).click();

    // Kiểm tra điều hướng
    cy.url().should("include", "/admin");

    // Kiểm tra có phần tử dashboard admin
    cy.contains("Trang quản lý").should("be.visible");
  });
});
