import React from 'react';
import '../styles/ProgressIndicator.css';

interface ProgressIndicatorProps {
  totalSteps: number;
  currentStep: number;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ totalSteps, currentStep }) => {
  return (
    <div className="progress-container flex-row items-center justify-center">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div
          key={index}
          className={`progress-dot ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
        />
      ))}
    </div>
  );
};
