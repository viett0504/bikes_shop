import React from "react";

export default function ValueCard({ icon: Icon, title, description }) {
  return (
    <div className="value-card">
      <Icon className="value-card__icon" />
      <h3 className="value-card__title">{title}</h3>
      <p className="value-card__desc">{description}</p>
    </div>
  );
}
    