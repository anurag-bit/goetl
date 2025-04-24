import React from "react";
import { FiCheck } from "react-icons/fi";

const ProgressSteps = ({ steps, activeStep }) => {
  return (
    <div className="progress-steps">
      {steps.map((step, index) => (
        <div 
          key={index} 
          className={`progress-step ${index === activeStep ? 'active' : ''} ${step.completed ? 'completed' : ''}`}
        >
          <div className="step-indicator">
            {step.completed ? <FiCheck /> : index + 1}
          </div>
          <div className="progress-step-label">{step.label}</div>
        </div>
      ))}
    </div>
  );
};

export default ProgressSteps;
