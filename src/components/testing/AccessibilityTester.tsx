
import React from 'react';

interface AccessibilityTesterProps {
  children: React.ReactNode;
  showResults: boolean;
  autoRun?: boolean;
}

export const AccessibilityTester: React.FC<AccessibilityTesterProps> = ({ 
  children, 
  showResults, 
  autoRun = false 
}) => {
  return (
    <div className="accessibility-tester">
      {children}
      
      {showResults && (
        <div className="accessibility-results">
          <button>Run Tests</button>
          {autoRun && <span className="auto-run-indicator">Auto-run enabled</span>}
        </div>
      )}
    </div>
  );
};
