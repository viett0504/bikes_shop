import React from "react";
import { Award, Users, TrendingUp, Heart, Target, Zap, Shield, Star } from "lucide-react";

import FeatureCard from "../../components/About/FeatureCard";
import StatCard from "../../components/About/StatCard";
import ValueCard from "../../components/About/ValueCard";
import TimelineItem from "../../components/About/TimeLineItem";

import "./About.css";

export default function BikeShopAbout() {
  return (
    <div className="page">
      {/* Hero Section */}
      <section className="hero-about">
        <div className="container hero__inner">
          <h1 className="hero__title">🚴 HUY VIET NAM BikeShop </h1>
          <p className="hero__subtitle">Đồng hành cùng đam mê của bạn</p>
          <p className="hero__desc">
            Chúng tôi không chỉ bán xe đạp, chúng tôi mang đến phong cách sống năng động, khỏe mạnh
            và thân thiện với môi trường cho hàng nghìn khách hàng trên toàn quốc.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="container stats__grid">
          <StatCard number="10+" label="Năm kinh nghiệm" />
          <StatCard number="50K+" label="Khách hàng" />
          <StatCard number="500+" label="Mẫu xe đạp" />
          <StatCard number="98%" label="Hài lòng" />
        </div>
      </section>

      {/* Story Section */}
      <section className="container section">
        <div className="section__header">
          <h2 className="section__title">Câu chuyện của chúng tôi</h2>
          <div className="divider" />
          <p className="section__lead">
            BikeShop Vietnam được thành lập vào năm 2015 với sứ mệnh đơn giản nhưng mạnh mẽ:
            mang đến những chiếc xe đạp chất lượng cao và dịch vụ tận tâm cho mọi người Việt Nam.
            Từ một cửa hàng nhỏ với niềm đam mê xe đạp, chúng tôi đã phát triển thành một trong
            những thương hiệu uy tín hàng đầu trong ngành.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid-3">
          <FeatureCard
            icon={Award}
            title="Chất lượng đảm bảo"
            description="100% xe đạp chính hãng từ các thương hiệu uy tín hàng đầu thế giới. Bảo hành chính hãng, đổi trả trong 30 ngày."
          />
          <FeatureCard
            icon={Users}
            title="Đội ngũ chuyên nghiệp"
            description="Đội ngũ tư vấn viên và kỹ thuật viên giàu kinh nghiệm, nhiệt tình hỗ trợ bạn chọn xe và bảo dưỡng định kỳ."
          />
          <FeatureCard
            icon={TrendingUp}
            title="Giá cả cạnh tranh"
            description="Cam kết giá tốt nhất thị trường. Nhiều chương trình khuyến mãi hấp dẫn và hỗ trợ trả góp 0% lãi suất."
          />
        </div>

        {/* Values Section */}
        <div className="section--spaced">
          <h2 className="section__title center">Giá trị cốt lõi</h2>
          <div className="grid-4">
            <ValueCard
              icon={Heart}
              title="Đam mê"
              description="Chúng tôi yêu xe đạp và muốn chia sẻ niềm đam mê này với mọi người"
            />
            <ValueCard
              icon={Target}
              title="Tận tâm"
              description="Luôn đặt khách hàng làm trung tâm trong mọi quyết định của chúng tôi"
            />
            <ValueCard
              icon={Zap}
              title="Sáng tạo"
              description="Không ngừng cải tiến để mang đến trải nghiệm tốt nhất"
            />
            <ValueCard
              icon={Shield}
              title="Uy tín"
              description="Xây dựng niềm tin qua chất lượng sản phẩm và dịch vụ"
            />
          </div>
        </div>

        {/* Timeline */}
        <div className="section--spaced">
          <h2 className="section__title center">Hành trình phát triển</h2>
          <div className="timeline">
            <div className="timeline__line" />
            <TimelineItem
              year="2015"
              title="Khởi đầu"
              description="Mở cửa hàng đầu tiên tại TP.HCM với 50 mẫu xe đạp"
              side="left"
            />
            <TimelineItem
              year="2017"
              title="Mở rộng"
              description="Phát triển hệ thống 5 cửa hàng, đạt 10,000 khách hàng"
              side="right"
            />
            <TimelineItem
              year="2019"
              title="Đột phá"
              description="Ra mắt website và ứng dụng di động, bán hàng toàn quốc"
              side="left"
            />
            <TimelineItem
              year="2022"
              title="Hợp tác"
              description="Trở thành đối tác chính thức của Giant, Trek, Specialized"
              side="right"
            />
            <TimelineItem
              year="2025"
              title="Hiện tại"
              description="15 cửa hàng trên toàn quốc, phục vụ hơn 50,000 khách hàng"
              side="left"
            />
          </div>
        </div>

        {/* Commitment Section */}
        <div className="commit">
          <Star className="commit__icon" />
          <h2 className="commit__title">Cam kết của chúng tôi</h2>
          <p className="commit__desc">
            BikeShop Vietnam cam kết mang đến cho bạn những sản phẩm chất lượng cao nhất,
            dịch vụ tận tâm nhất và trải nghiệm mua sắm tuyệt vời nhất. Chúng tôi không chỉ
            bán xe đạp, chúng tôi xây dựng một cộng đồng yêu thích phong cách sống khỏe mạnh
            và bảo vệ môi trường.
          </p>
          <button className="btn-primary">Khám phá sản phẩm</button>
        </div>
      </section>
    </div>
  );
}
