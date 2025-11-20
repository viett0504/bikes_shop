/// <reference types="cypress" />

// Hàm tiện ích: lấy giá từ text trong 1 card
function extractPriceFromCard(cardEl) {
  const text = Cypress.$(cardEl).text();        // toàn bộ text trong card
  const match = text.match(/([\d\.]+)\s*đ/);    // bắt chuỗi dạng "36.520.000 đ"
  if (!match) return 0;
  const raw = match[1].replace(/\./g, '');      // bỏ dấu chấm ngăn cách nghìn
  return parseInt(raw, 10);
}

describe('Sắp xếp sản phẩm theo giá', () => {
  beforeEach(() => {
    // Trang product của bạn
    cy.visit('http://localhost:3000/product');
  });

  it('Sắp xếp theo "Giá thấp → cao"', () => {
    // Chọn option sort
    cy.get('.sort-section select').select('Giá thấp → cao');

    // Lấy danh sách card sản phẩm
    cy.get('.product-card')
      .should('have.length.at.least', 2)       // cần ít nhất 2 sản phẩm để so sánh
      .then(($cards) => {
        const firstPrice = extractPriceFromCard($cards[0]);
        const lastPrice = extractPriceFromCard($cards[$cards.length - 1]);

        // Với "Giá thấp → cao" thì giá đầu phải <= giá cuối
        expect(firstPrice).to.be.at.most(lastPrice);
      });
  });

  it('Sắp xếp theo "Giá cao → thấp"', () => {
    // Chọn option sort
    cy.get('.sort-section select').select('Giá cao → thấp');

    cy.get('.product-card')
      .should('have.length.at.least', 2)
      .then(($cards) => {
        const firstPrice = extractPriceFromCard($cards[0]);
        const lastPrice = extractPriceFromCard($cards[$cards.length - 1]);

        // Với "Giá cao → thấp" thì giá đầu phải >= giá cuối
        expect(firstPrice).to.be.at.least(lastPrice);
      });
  });
});
