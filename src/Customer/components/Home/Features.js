import React from "react";

const Features = () => (
  <section className="features" id="about">
    <div className="features-grid">
      <div className="feature-card">
        <div className="feature-icon">✨</div>
        <h3>Chất Lượng Cao</h3>
        <p>100% sản phẩm chính hãng, được kiểm tra kỹ lưỡng</p>
      </div>
      <div className="feature-card">
        <div className="feature-icon">🚚</div>
        <h3>Giao Hàng Nhanh</h3>
        <p>Giao hàng miễn phí toàn quốc trong 24-48h</p>
      </div>
      <div className="feature-card">
        <div className="feature-icon">🛡️</div>
        <h3>Bảo Hành Tốt</h3>
        <p>Bảo hành 2 năm, hỗ trợ kỹ thuật trọn đời</p>
      </div>
      <div className="feature-card">
        <div className="feature-icon">💰</div>
        <h3>Giá Cả Hợp Lý</h3>
        <p>Cam kết giá tốt nhất thị trường</p>
      </div>
    </div>
  </section>
);

export default Features;
