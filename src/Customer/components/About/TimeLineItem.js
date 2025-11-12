import React from "react";

export default function TimelineItem({ year, title, description, side = "left" }) {
  return (
    <div className={`timeline-item ${side === "right" ? "timeline-item--right" : ""}`}>
      <div className={`timeline-item__content ${side === "left" ? "align-right" : "align-left"}`}>
        <div className="timeline-card">
          <div className="timeline-card__year">{year}</div>
          <h4 className="timeline-card__title">{title}</h4>
          <p className="timeline-card__desc">{description}</p>
        </div>
      </div>
      <div className="timeline-dot" />
      <div className="timeline-spacer" />
    </div>
  );
}
    