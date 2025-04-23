import React from "react";

const StatCard = ({ icon, title, value, color = "blue", trend, trendValue }) => {
  return (
    <div className={`stat-card ${color}`}>
      <div className="stat-header">
        <div className="stat-icon">{icon}</div>
        <div className="stat-title">{title}</div>
      </div>
      
      <div className="stat-value">{value}</div>
      
      {trend && (
        <div className={`stat-trend ${trend}`}>
          {trend === "up" ? "↑" : "↓"} {trendValue}
        </div>
      )}
    </div>
  );
};

export default StatCard;
