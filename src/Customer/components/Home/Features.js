import React from "react";

const features = [
  {
    icon: "✨",
    title: "Chất Lượng Cao",
    description: "100% sản phẩm chính hãng, được kiểm tra kỹ lưỡng",
  },
  {
    icon: "🚚",
    title: "Giao Hàng Nhanh",
    description: "Giao hàng miễn phí toàn quốc trong 24–48h",
  },
  {
    icon: "🛡️",
    title: "Bảo Hành Tốt",
    description: "Bảo hành 2 năm, hỗ trợ kỹ thuật trọn đời",
  },
  {
    icon: "💰",
    title: "Giá Cả Hợp Lý",
    description: "Cam kết giá tốt nhất thị trường",
  },
];

const Features = () => (
  <section className="home-features" id="about">
    <div className="features-inner">
      <div className="features-headline">
        <p className="features-kicker">TẠI SAO CHỌN CHÚNG TÔI</p>
        <h2>Dịch vụ & cam kết dành cho bạn</h2>
        <p className="features-subtitle">
          Chúng tôi mang đến trải nghiệm mua xe đạp trọn vẹn: từ chất lượng sản phẩm,
          chính sách giá đến dịch vụ sau bán hàng.
        </p>
      </div>

      <div className="features-grid">
        {features.map((item) => (
          <div className="feature-card" key={item.title}>
            <div className="feature-icon-wrap">
              <span className="feature-icon">{item.icon}</span>
            </div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Features;
