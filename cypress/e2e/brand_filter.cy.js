// cypress/e2e/brand_filter.cy.js

/// <reference types="cypress" />

// Hàm tiện ích: chọn radio trong phần "Thương hiệu"
const selectBrand = (brandText) => {
  // Chờ dữ liệu load xong (ít nhất có 1 card)
  cy.get('.product-card').should('have.length.at.least', 1)

  // Tìm block "Thương hiệu" rồi click vào label có chữ brandText
  cy.contains('h3', 'Thương hiệu')
    .parent()              // div.filter-section
    .within(() => {
      cy.contains('label', brandText).click()
    })

  // Sau khi lọc xong vẫn phải có ít nhất 1 sản phẩm
  cy.get('.product-card').should('have.length.at.least', 1)
}

describe('Lọc theo Thương hiệu trên trang /product', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/product')
  })

  it('Lọc thương hiệu "Trinix" hiển thị đúng', () => {
    const brand = 'Trinix'
    selectBrand(brand)

    // Mọi product-card trên trang đều phải chứa chữ "Trinix"
    cy.get('.product-card').each(($card) => {
      cy.wrap($card).should('contain.text', brand)
    })
  })

  it('Lọc thương hiệu "Trek" hiển thị đúng', () => {
    const brand = 'Trek'
    selectBrand(brand)

    cy.get('.product-card').each(($card) => {
      cy.wrap($card).should('contain.text', brand)
    })
  })

  it('Lọc thương hiệu "Specialized" hiển thị đúng', () => {
    const brand = 'Specialized'
    selectBrand(brand)

    cy.get('.product-card').each(($card) => {
      cy.wrap($card).should('contain.text', brand)
    })
  })
})
