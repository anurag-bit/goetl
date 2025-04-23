import React from "react";
import { FiAlertCircle, FiInfo, FiCheckCircle, FiXCircle, FiX } from "react-icons/fi";

const Alert = ({ type = "info", message, onClose, dismissible = false }) => {
  if (!message) return null;
  
  const getIcon = () => {
    switch (type) {
      case "success": return <FiCheckCircle />;
      case "error": return <FiAlertCircle />;
      case "warning": return <FiXCircle />;
      default: return <FiInfo />;
    }
  };
  
  return (
    <div className={`alert ${type}`}>
      <div className="alert-icon">{getIcon()}</div>
      <div className="alert-content">{message}</div>
      
      {dismissible && onClose && (
        <button className="alert-close" onClick={onClose} aria-label="Close">
          <FiX />
        </button>
      )}
    </div>
  );
};

export default Alert;
