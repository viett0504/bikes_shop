import React, { useState } from 'react';
import { Phone, Mail } from 'lucide-react';
import './TeamCard.css';

const TeamCard = ({ member, icon: Icon, title, children }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`team-card ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="team-card-topbar" />

      {member ? (
        <>
          <div className="team-card-avatar">
            <img src={member.avatar} alt={member.name} />
          </div>

          <h3 className="team-card-name">{member.name}</h3>
          <p className="team-card-position">{member.position}</p>
          <p className="team-card-desc">{member.description}</p>

          <div className="team-card-contact">
            <div className="contact-item">
              <Phone className="icon" />
              <span>{member.phone}</span>
            </div>
            <div className="contact-item">
              <Mail className="icon" />
              <span>{member.email}</span>
            </div>
          </div>
        </>
      ) : (
        <>
          {Icon && <Icon className="team-card-icon" size={48} />}
          {title && <h3 className="team-card-title">{title}</h3>}
          {children}
        </>
      )}
    </div>
  );
};

export default TeamCard;
