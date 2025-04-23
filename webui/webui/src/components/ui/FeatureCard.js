import React from "react";

const FeatureCard = ({ icon, title, description, linkTo, linkText }) => {
  const cardContent = (
    <>
      <div className="feature-icon">{icon}</div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-description">{description}</p>
      {linkTo && linkText && (
        <div className="feature-link">
          <span>{linkText}</span>
        </div>
      )}
    </>
  );

  if (linkTo) {
    return (
      <a href={linkTo} className="feature-card">
        {cardContent}
      </a>
    );
  }

  return <div className="feature-card">{cardContent}</div>;
};

export default FeatureCard;
