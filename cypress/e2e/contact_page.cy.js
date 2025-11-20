// cypress/e2e/contact_page.cy.js

describe("Trang Contact - xem đầy đủ thông tin", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/contact");
  });

  it("hiển thị heading và 3 thành viên team", () => {
    // Heading chính
    cy.contains("h1", "LIÊN HỆ VỚI CHÚNG TÔI").should("be.visible");

    // Các thành viên team
    cy.contains("Nguyễn Gia Huy").should("be.visible");
    cy.contains("Nguyễn Hoàng Việt").should("be.visible");
    cy.contains("Văn Tiến Nam").should("be.visible");
  });

  it("cuộn hết trang và xem block Thông Tin Cửa Hàng", () => {
    // Đảm bảo trang đã load
    cy.get(".contact-page").should("exist");

    // Cuộn từ từ xuống cuối trang
    cy.scrollTo("bottom", { duration: 800 });

    // Kiểm tra tiêu đề block info
    cy.contains("h2", "Thông Tin Cửa Hàng").should("be.visible");

    // Kiểm tra một số thông tin chi tiết trong block cuối
    cy.contains("p", "427 Phạm Văn Đồng").should("be.visible");
    cy.contains("p", "Thứ 2 - Thứ 7: 8:00 - 20:00").should("be.visible");
    cy.contains("p", "Trả góp 0% lãi suất").should("be.visible");
  });
});
