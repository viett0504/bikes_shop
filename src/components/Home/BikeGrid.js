import React from "react";
import BikeCard from "../BikeCard";

const bikes = [
  { name: "Mountain Pro X1", desc: "Xe đạp địa hình cao cấp, phù hợp với mọi địa hình khắc nghiệt", price: "12,500,000₫", emoji: "🚵", bg: "linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%)" },
  { name: "City Cruiser 500", desc: "Xe đạp thành phố thanh lịch, hoàn hảo cho di chuyển hàng ngày", price: "6,800,000₫", emoji: "🚴‍♂️", bg: "linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)" },
  { name: "Sport Racer Z9", desc: "Xe đạp đua tốc độ cao, thiết kế khí động học tối ưu", price: "18,900,000₫", emoji: "🚴‍♀️", bg: "linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%)" },
  { name: "Kids Joy Mini", desc: "Xe đạp trẻ em an toàn, vui nhộn và dễ sử dụng", price: "2,500,000₫", emoji: "🚲", bg: "linear-gradient(135deg, #fd79a8 0%, #e84393 100%)" },
  { name: "Electric Boost E5", desc: "Xe đạp điện thông minh, di chuyển xa không mệt mỏi", price: "22,000,000₫", emoji: "🚴", bg: "linear-gradient(135deg, #55efc4 0%, #00b894 100%)" },
  { name: "Folding Smart F3", desc: "Xe đạp gấp thông minh, tiện lợi mang theo mọi nơi", price: "8,200,000₫", emoji: "🚵‍♀️", bg: "linear-gradient(135deg, #fab1a0 0%, #ff7675 100%)" },
];

const BikeGrid = ({ addToCart }) => (
  <div className="container" id="bikes">
    <h2 className="section-title">Sản Phẩm Nổi Bật</h2>
    <div className="bikes-grid">
      {bikes.map((b, i) => (
        <BikeCard key={i} bike={b} addToCart={addToCart} />
      ))}
    </div>
  </div>
);

export default BikeGrid;
