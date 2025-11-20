// src/Customer/components/Home/BikeGrid.js
import React, { useEffect, useState } from "react";
import ProductCard from "../Product/ProductCard";
import { getHomeProducts, getHomeCategories } from "./FetchApi";

const apiURL = process.env.REACT_APP_API_URL;

// Format giá
const formatPrice = (price) => {
  if (price === undefined || price === null) return "—";
  try {
    return Number(price).toLocaleString("vi-VN") + "₫";
  } catch {
    return price + "₫";
  }
};

// Xử lý ảnh (dùng chung cho product + brand)
const getImageSrc = (img) => {
  if (!img) return "/images/placeholder-bike.png";

  if (img.startsWith("http") && img.includes("/ipfs/")) {
    const cid = img.split("/ipfs/")[1];
    if (cid) return `https://ipfs.filebase.io/ipfs/${cid}`;
  }

  if (!img.startsWith("http") && img.startsWith("Qm")) {
    return `https://ipfs.filebase.io/ipfs/${img}`;
  }

  if (!img.startsWith("http")) {
    return `${apiURL}/uploads/products/${img}`;
  }

  return img;
};

const BikeGrid = () => {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);

        // Lấy song song sản phẩm + thương hiệu
        const [resProducts, resCategories] = await Promise.all([
          getHomeProducts(),
          getHomeCategories(),
        ]);

        // --- Map sản phẩm nổi bật (lấy 6 cái đầu) ---
        const listProducts = resProducts?.Products || resProducts || [];
        const mappedProducts = listProducts.slice(0, 6).map((p) => ({
          id: p._id,                          // CHÚ Ý: ProductCard dùng "id"
          name: p.pName,
          price: p.pPrice,
          brand: p.pCategory?.cName || "—",
          image: getImageSrc(
            Array.isArray(p.pImages) ? p.pImages[0] : p.pImages
          ),
          rating: 4.5,
          reviews: Array.isArray(p.pRatingsReviews)
            ? p.pRatingsReviews.length
            : 0,
        }));
        setProducts(mappedProducts);

        // --- Map thương hiệu nổi bật (category) ---
        const listCategories = resCategories || [];
        const mappedBrands = listCategories.slice(0, 6).map((c) => ({
          id: c._id,
          name: c.cName,
          image: getImageSrc(c.cImage || c.cImageUrl),
        }));
        setBrands(mappedBrands);
      } catch (err) {
        console.error("Lỗi load dữ liệu Home:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="bike-grid-section">

      <div className="container" id="bikes">
        <h2 className="section-title">Sản phẩm nổi bật</h2>

        {loading ? (
          <div style={{ textAlign: "center" }}>Đang tải...</div>
        ) : (
          <div className="bikes-grid">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                formatPrice={formatPrice}
              />
            ))}
          </div>
        )}
      </div>

      {/* ========== THƯƠNG HIỆU NỔI BẬT ========== */}
      <div className="container" id="brands">
        <h2 className="section-title">Thương hiệu nổi bật</h2>

        {loading ? (
          <div style={{ textAlign: "center" }}>Đang tải...</div>
        ) : (
          <div className="bikes-grid">
            {brands.map((b) => (
              <div key={b.id} className="brand-card">
                <div className="brand-image-wrap">
                  <img
                    src={b.image}
                    alt={b.name}
                    className="brand-image"
                  />
                </div>
                <div className="brand-name">{b.name}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BikeGrid;
