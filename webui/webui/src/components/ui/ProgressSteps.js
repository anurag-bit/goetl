import React from "react";
import { FiCheck } from "react-icons/fi";

const ProgressSteps = ({ steps, activeStep }) => {
  return (
    <div className="progress-steps">
      {steps.map((step, index) => {
        const isActive = index === activeStep;
        const isCompleted = step.completed || index < activeStep;
        
        return (
          <div 
            key={index} 
            className={`progress-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
          >
            <div className="step-indicator">
              {isCompleted ? (
                <span className="step-completed">
                  <FiCheck />
                </span>
              ) : (
                <span className="step-number">{index + 1}</span>
              )}
            </div>
            <div className="step-connector">
              {index < steps.length - 1 && <div className="connector-line"></div>}
            </div>
            <div className="step-label">{step.label}</div>
          </div>
        );
      })}
    </div>
  );
};

export default ProgressSteps;
