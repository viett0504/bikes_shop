import React from "react";

export default function StatCard({ number, label }) {
  return (
    <div className="stat-card">
      <div className="stat-card__number">{number}</div>
      <div className="stat-card__label">{label}</div>
    </div>
  );
}
