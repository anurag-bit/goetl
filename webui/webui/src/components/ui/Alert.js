import React from "react";
import { FiAlertCircle, FiCheckCircle, FiInfo } from "react-icons/fi";

const Alert = ({ type = "info", message }) => {
  const icons = {
    info: <FiInfo />,
    success: <FiCheckCircle />,
    error: <FiAlertCircle />
  };

  return (
    <div className={`alert ${type}`}>
      <div className="alert-icon">
        {icons[type]}
      </div>
      <div className="alert-message">{message}</div>
    </div>
  );
};

export default Alert;
