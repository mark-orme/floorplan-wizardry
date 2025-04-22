
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  runAccessibilityCheck, 
  checkColorContrast, 
  validateAriaAttributes,
  AccessibilityIssue,
  loadAccessibilityTester
} from '@/utils/testing/accessibilityTester';

interface AccessibilityTesterProps {
  selector?: string;
}

export function AccessibilityTester({ selector = 'body' }: AccessibilityTesterProps) {
  const [issues, setIssues] = useState<AccessibilityIssue[]>([]);
  const [loading, setLoading] = useState(false);

  const runTest = async () => {
    setLoading(true);
    try {
      // Note: This is just for demonstration
      // In a real app, you would need to integrate this with Playwright or
      // use a browser extension approach to run accessibility tests
      await loadAccessibilityTester();
      
      // Mock implementation since we can't run actual Playwright tests in the browser
      setTimeout(() => {
        setIssues([
          {
            id: 'color-contrast',
            impact: 'serious',
            description: 'Elements must have sufficient color contrast',
            nodes: ['.low-contrast-text']
          },
          {
            id: 'aria-required-attr',
            impact: 'critical',
            description: 'Required ARIA attributes must be provided',
            nodes: ['#missing-aria-label']
          }
        ]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error running accessibility test:', error);
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-md">
      <h2 className="text-xl font-semibold mb-4">Accessibility Tester</h2>
      <div className="mb-4">
        <Button 
          onClick={runTest}
          disabled={loading}
          className="mr-2"
        >
          {loading ? 'Running Tests...' : 'Run A11y Tests'}
        </Button>
        <span className="text-sm text-gray-500">Testing selector: {selector}</span>
      </div>
      
      {issues.length > 0 && (
        <div className="mt-4">
          <h3 className="font-medium mb-2">Issues Found ({issues.length})</h3>
          <ul className="space-y-2">
            {issues.map((issue, index) => (
              <li key={index} className="p-3 bg-red-50 border border-red-200 rounded">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{issue.description}</span>
                  <span className={`px-2 py-1 text-xs rounded ${
                    issue.impact === 'critical' ? 'bg-red-600 text-white' : 
                    issue.impact === 'serious' ? 'bg-orange-500 text-white' : 
                    'bg-yellow-200 text-yellow-800'
                  }`}>
                    {issue.impact}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Affected elements: {issue.nodes.join(', ')}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {issues.length === 0 && !loading && (
        <div className="p-3 bg-green-50 border border-green-200 rounded">
          <p className="text-green-800">No accessibility issues detected!</p>
        </div>
      )}
      
      <div className="mt-4 text-xs text-gray-500">
        Note: This is a simplified demonstration. In a real application, you would integrate with 
        Playwright and axe-core for comprehensive accessibility testing.
      </div>
    </div>
  );
}

export default AccessibilityTester;
