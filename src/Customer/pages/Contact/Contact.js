import React from 'react';
import { MapPin, Clock, Globe, CreditCard } from 'lucide-react';
import TeamCard from '../../components/Contact/TeamCard';
import './Contact.css'; 

export default function Contact() {
  const teamMembers = [
    {
      id: 1,
      avatar: '👨‍💼',
      name: 'Nguyễn Văn An',
      position: 'Giám Đốc Kinh Doanh',
      description:
        'Chuyên gia với hơn 10 năm kinh nghiệm trong ngành xe đạp. Tư vấn về các dòng xe cao cấp và xe đua chuyên nghiệp.',
      phone: '0912 345 678',
      email: 'an.nguyen@bikeshop.vn',
    },
    {
      id: 2,
      avatar: '👩‍💼',
      name: 'Trần Thị Bích',
      position: 'Trưởng Phòng Tư Vấn',
      description:
        'Chuyên tư vấn xe đạp địa hình, xe đạp thành phố và phụ kiện. Nhiệt tình hỗ trợ khách hàng chọn lựa sản phẩm phù hợp.',
      phone: '0987 654 321',
      email: 'bich.tran@bikeshop.vn',
    },
    {
      id: 3,
      avatar: '👨‍🔧',
      name: 'Lê Minh Đức',
      position: 'Kỹ Thuật Viên Trưởng',
      description:
        'Chuyên gia bảo dưỡng và sửa chữa xe đạp. Tư vấn kỹ thuật, nâng cấp và tùy chỉnh xe theo nhu cầu khách hàng.',
      phone: '0901 234 567',
      email: 'duc.le@bikeshop.vn',
    },
    {
      id: 4,
      avatar: '👩‍💻',
      name: 'Phạm Thu Hà',
      position: 'Chuyên Viên CSKH',
      description:
        'Giải đáp thắc mắc, xử lý đơn hàng và chăm sóc khách hàng. Luôn sẵn sàng lắng nghe và hỗ trợ bạn 24/7.',
      phone: '0935 876 543',
      email: 'ha.pham@bikeshop.vn',
    },
  ];

  return (
    <div className="contact-page">
      <div className="contact-container">
        {/* Header */}
        <div className="contact-header">
          <h1>🚴 Liên Hệ Với Chúng Tôi</h1>
          <p>Đội ngũ chuyên nghiệp sẵn sàng tư vấn và hỗ trợ bạn</p>
        </div>

        {/* Team Grid */}
        <div className="team-grid">
          {teamMembers.map((member) => (
            <TeamCard key={member.id} member={member} />
          ))}
        </div>

        {/* Store Info */}
        <div className="store-info">
          <h2>Thông Tin Cửa Hàng</h2>
          <div className="info-grid">
            <TeamCard icon={MapPin} title="Địa Chỉ">
              <p>123 Đường Nguyễn Huệ</p>
              <p>Quận 1, TP. Hồ Chí Minh</p>
              <p>Việt Nam</p>
            </TeamCard>

            <TeamCard icon={Clock} title="Giờ Mở Cửa">
              <p>Thứ 2 - Thứ 7: 8:00 - 20:00</p>
              <p>Chủ Nhật: 9:00 - 18:00</p>
              <p>Nghỉ lễ, tết theo quy định</p>
            </TeamCard>

            <TeamCard icon={Globe} title="Kết Nối">
              <p>Website: www.bikeshop.vn</p>
              <p>Facebook: /bikeshopvn</p>
              <p>Instagram: @bikeshopvn</p>
            </TeamCard>

            <TeamCard icon={CreditCard} title="Thanh Toán">
              <p>Tiền mặt, Chuyển khoản</p>
              <p>Visa, Mastercard</p>
              <p>Trả góp 0% lãi suất</p>
            </TeamCard>
          </div>
        </div>
      </div>
    </div>
  );
}
