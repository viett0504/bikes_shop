// src/pages/Products/ProductPage.test.js
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProductPage from './ProductPage';
import { getAllProduct } from '../../components/Product/fetchApi';

// Mock API
jest.mock('../../components/Product/fetchApi', () => ({
  getAllProduct: jest.fn(),
}));

// Mock ProductCard để dễ assert
jest.mock('../../components/Product/ProductCard', () => (props) => {
  const { product } = props;
  return (
    <div data-testid="product-card">
      <span data-testid="product-name">{product.name}</span>
      <span data-testid="product-brand">{product.brand}</span>
      <span data-testid="product-price">{product.price}</span>
    </div>
  );
});

const mockProducts = [
  {
    _id: '1',
    pName: 'Xe A',
    pCategory: { cName: 'Giant' },
    pBiketype: { tName: 'Road' },
    pPrice: 8000000,
    pOffer: 0,
    pRatingsReviews: [{ rating: 4 }],
    pImages: ['https://example.com/a.jpg'],
  },
  {
    _id: '2',
    pName: 'Xe B',
    pCategory: { cName: 'Trek' },
    pBiketype: { tName: 'Mountain' },
    pPrice: 12000000,
    pOffer: 0,
    pRatingsReviews: [{ rating: 5 }],
    pImages: ['https://example.com/b.jpg'],
  },
  {
    _id: '3',
    pName: 'Xe C',
    pCategory: { cName: 'Giant' },
    pBiketype: { tName: 'City' },
    pPrice: 10000000,
    pOffer: 0,
    pRatingsReviews: [],
    pImages: ['https://example.com/c.jpg'],
  },
];

const renderPage = async () => {
  getAllProduct.mockResolvedValueOnce(mockProducts);

  render(
    <MemoryRouter>
      <ProductPage />
    </MemoryRouter>
  );

  // Đợi API được gọi và data render
  await waitFor(() => expect(getAllProduct).toHaveBeenCalled());
};

describe('ProductPage filters & sorting', () => {
  test('lọc theo thương hiệu Giant chỉ hiển thị sản phẩm Giant', async () => {
  await renderPage();

  // 🔥 Đợi cho API load xong brandOptions render ra
  const giantRadio = await screen.findByLabelText('Giant');

  // Click chọn Giant
  fireEvent.click(giantRadio);

  const cards = await screen.findAllByTestId('product-card');
  expect(cards).toHaveLength(2);

  cards.forEach((card) => {
    expect(card).toHaveTextContent('Giant');
  });

  // đảm bảo sản phẩm Trek không còn nữa
  expect(screen.queryByText('Xe B')).toBeNull();
});


  test('sắp xếp theo "Giá thấp → cao" hiển thị đúng thứ tự giá', async () => {
    await renderPage();

    // Đổi select sang "Giá thấp → cao"
    const select = screen.getByDisplayValue('Nổi bật').closest('select');
    fireEvent.change(select, { target: { value: 'price-low' } });

    const priceNodes = await screen.findAllByTestId('product-price');
    const prices = priceNodes.map((node) => Number(node.textContent));
    const sorted = [...prices].sort((a, b) => a - b);

    expect(prices).toEqual(sorted);
  });
});
