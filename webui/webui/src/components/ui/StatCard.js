import React from "react";

const StatCard = ({ icon, title, value, color = "blue" }) => {
  return (
    <div className={`stat-card color-${color}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <div className="stat-value">{value}</div>
        <div className="stat-title">{title}</div>
      </div>
    </div>
  );
};

export default StatCard;
