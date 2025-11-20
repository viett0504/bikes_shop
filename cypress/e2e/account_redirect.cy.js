describe("Account redirect test", () => {
  it("Click 'Tiếp tục mua sắm' sẽ điều hướng sang /product", () => {

    // Truy cập trang Account
    cy.visit("http://localhost:3000/account");

    // Nhấn nút
    cy.contains("Tiếp tục mua sắm").click();

    // Kiểm tra đã chuyển hướng sang /product
    cy.url().should("include", "/product");
  });
});
