// src/components/Home/BikeGrid.js
import React, { useEffect, useState } from "react";
import ProductCard from "../Product/ProductCard";
import { getHomeProducts } from "./FetchApi";

const apiURL = process.env.REACT_APP_API_URL;

// Format giá giống mọi nơi
const formatPrice = (price) => {
  if (price === undefined || price === null) return "—";
  try {
    return Number(price).toLocaleString("vi-VN") + "₫";
  } catch {
    return price + "₫";
  }
};

// Xử lý ảnh giống ProductTable
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await getHomeProducts();
        const list = res?.Products || [];

        // ⚡ chỉ lấy 6 SP nổi bật
        const mapped = list.slice(0, 6).map((p) => ({
          _id: p._id,
          name: p.pName,
          price: p.pPrice,
          brand: p.pCategory?.cName || "—",
          image: getImageSrc(
            Array.isArray(p.pImages) ? p.pImages[0] : p.pImages
          ),
          rating: 4.5, // tạm
          reviews: Array.isArray(p.pRatingsReviews)
            ? p.pRatingsReviews.length
            : 0,
        }));

        setProducts(mapped);
      } catch (err) {
        console.error("Lỗi load SP nổi bật:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <div className="container" id="bikes">
      <h2 className="section-title">Sản phẩm nổi bật</h2>

      {loading ? (
        <div style={{ textAlign: "center" }}>Đang tải...</div>
      ) : (
        <div className="bikes-grid">
          {products.map((p) => (
            <ProductCard
              key={p._id}
              product={p}
              formatPrice={formatPrice}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BikeGrid;
