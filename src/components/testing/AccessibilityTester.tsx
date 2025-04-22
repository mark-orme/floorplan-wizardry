
import React from 'react';
import { axe, toHaveNoViolations } from 'jest-axe';

export interface AccessibilityTesterProps {
  showResults: boolean;
  autoRun?: boolean;
  children?: React.ReactNode;
}

export const AccessibilityTester: React.FC<AccessibilityTesterProps> = ({ 
  showResults,
  autoRun = false,
  children
}) => {
  React.useEffect(() => {
    if (showResults) {
      expect.extend(toHaveNoViolations);

      const runAxe = async () => {
        try {
          const app = document.getElementById('root');
          if (app) {
            const results = await axe(app);
            expect(results).toHaveNoViolations();
          } else {
            console.warn('AccessibilityTester: #root element not found.');
          }
        } catch (error) {
          console.error('Accessibility test failed:', error);
        }
      };

      runAxe();
    }
  }, [showResults]);
  
  return (
    <div className="accessibility-tester">
      {children}
    </div>
  );
};

export default AccessibilityTester;
