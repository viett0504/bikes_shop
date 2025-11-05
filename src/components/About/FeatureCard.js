import React, { useState } from "react";

export default function FeatureCard({ icon: Icon, title, description }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`feature-card ${isHovered ? "feature-card--hover" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="feature-card__badge">
        <Icon className="icon--white" />
      </div>
      <h3 className="feature-card__title">{title}</h3>
      <p className="feature-card__desc">{description}</p>
    </div>
  );
}
