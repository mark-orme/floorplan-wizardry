import React from 'react';
import { axe, toHaveNoViolations } from 'jest-axe';

export interface AccessibilityTesterProps {
  showResults: boolean;
  children?: React.ReactNode; // Add children prop
}

export const AccessibilityTester: React.FC<AccessibilityTesterProps> = ({ 
  showResults,
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
      {/* You can add any additional elements or content here */}
    </div>
  );
};

export default AccessibilityTester;
