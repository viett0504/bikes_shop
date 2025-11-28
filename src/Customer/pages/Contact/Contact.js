import React from 'react';
import { MapPin, Clock, Globe, CreditCard } from 'lucide-react';
import TeamCard from '../../components/Contact/TeamCard';
import './Contact.css'; 

export default function Contact() {
  const teamMembers = [
    {
      id: 1,
      avatar: 'https://ipfs.filebase.io/ipfs/QmY3cm5i5FAMsMMAnQMVdhSQz2koeDBu9Yg1dJzV3c9eAt',
      name: 'Nguyễn Gia Huy',
      position: 'Giám Đốc kinh doanh',
      description:
        'Chuyên gia với hơn 10 năm kinh nghiệm trong ngành xe đạp. Tư vấn về các dòng xe cao cấp và xe đua chuyên nghiệp.',
      phone: '0912 345 678',
      email: 'huy.nguyen@bikeshop.vn',
    },
    {
      id: 2,
      avatar: 'https://ipfs.filebase.io/ipfs/QmfEbpaP3WbN8GZofxHe3FWGVSsQ2miuzJHizTWT2Q9cUG',
      name: 'Nguyễn Hoàng Việt',
      position: 'Trưởng phòng tư vấn',
      description:
        'Chuyên tư vấn xe đạp địa hình, xe đạp thành phố và phụ kiện. Nhiệt tình hỗ trợ khách hàng chọn lựa sản phẩm phù hợp.',
      phone: '0987 654 321',
      email: 'SieuTriTue.VietHoang@bikeshop.vn',
    },
    {
      id: 3,
      avatar: 'https://ipfs.filebase.io/ipfs/QmQfuu5Chj6qVTfyf3ZfmuV7H1ih7sPkECv8qYKCeTgW89',
      name: 'Văn Tiến Nam',
      position: 'Kỹ thuật viên trưởng',
      description:
        'Chuyên gia bảo dưỡng và sửa chữa xe đạp. Tư vấn kỹ thuật, nâng cấp và tùy chỉnh xe theo nhu cầu khách hàng.',
      phone: '0901 234 567',
      email: 'NghinNamVanVo@bikeshop.vn',
    },
  ];

  return (
    <div className="contact-page">
      <div className="contact-container">
        {/* Header */}
        <div className="contact-header">
          <h1>LIÊN HỆ VỚI CHÚNG TÔI</h1>
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
          <h2>Thông tin cửa hàng</h2>
          <div className="info-grid">
            <TeamCard icon={MapPin} title="Địa chỉ">
              <p>427 Phạm Văn Đồng</p>
              <p>Cổ Nhuế, Bắc Từ Liêm</p>
              <p>Hà Nội</p>
            </TeamCard>

            <TeamCard icon={Clock} title="Giờ mở cửa">
              <p>Thứ 2 - Thứ 7: 8:00 - 20:00</p>
              <p>Chủ Nhật: 9:00 - 18:00</p>
              <p>Nghỉ lễ, tết theo quy định</p>
            </TeamCard>

            <TeamCard icon={Globe} title="Kết nối">
              <p>Website: www.bikeshop.vn</p>
              <p>Facebook: /bikeshopvn</p>
              <p>Instagram: @bikeshopvn</p>
            </TeamCard>

            <TeamCard icon={CreditCard} title="Thanh toán">
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
