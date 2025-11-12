import React from "react";

const BikeCard = ({ bike, addToCart }) => (
  <div className="bike-card">
    <div className="bike-image" style={{ background: bike.bg }}>
      {bike.emoji}
    </div>
    <div className="bike-info">
      <div className="bike-name">{bike.name}</div>
      <div className="bike-description">{bike.desc}</div>
      <div className="bike-price">{bike.price}</div>
      <button className="buy-button" onClick={() => addToCart(bike.name)}>
        Thêm vào giỏ
      </button>
    </div>
  </div>
);

export default BikeCard;
