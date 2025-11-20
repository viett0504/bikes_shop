describe("Kiểm tra trang About", () => {

  it("Truy cập trang About và cuộn toàn trang", () => {
    // 1) Truy cập trang
    cy.visit("http://localhost:3000/about");

    // 2) Kiểm tra Hero section xuất hiện
    cy.contains("HUY VIET NAM BikeShop", { matchCase: false })
      .should("be.visible");

    // 3) Kiểm tra Stats section (10+, 50K+, ...)
    cy.contains("10+").should("be.visible");
    cy.contains("Khách hàng").should("be.visible");

    // 4) Kiểm tra story
    cy.contains("Câu Chuyện Của Chúng Tôi").scrollIntoView().should("be.visible");

    // 5) Cuộn xuống từ từ theo từng phần
    cy.scrollTo("center");
    cy.wait(500);

    cy.scrollTo("bottom");
    cy.wait(700);

    // 6) Kiểm tra Timeline section
    cy.contains("Hành Trình Phát Triển").should("be.visible");

    // Kiểm tra một số mốc thời gian
    cy.contains("2015").should("be.visible");
    cy.contains("2019").should("be.visible");
    cy.contains("2025").should("be.visible");

    // 7) Cuộn tới cuối trang và kiểm tra Commitment section
    cy.contains("Cam Kết Của Chúng Tôi")
      .scrollIntoView()
      .should("be.visible");

    // 8) Kiểm tra nút CTA
    cy.contains("Khám Phá Sản Phẩm")
      .should("be.visible")
      .and("have.class", "btn-primary");
  });

});
