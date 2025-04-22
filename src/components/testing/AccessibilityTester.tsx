
import React, { useEffect, useState } from 'react';
import {
  runAccessibilityAudit,
  AccessibilityIssue,
  loadAccessibilityTester
} from '@/utils/testing/accessibilityTester';

export interface AccessibilityTesterProps {
  /** Target element selector */
  selector?: string;
  /** Whether to run tests automatically */
  autoRun?: boolean;
  /** Whether to show test results */
  showResults?: boolean;
  /** Children */
  children?: React.ReactNode;
}

/**
 * Component for testing accessibility in development
 */
export const AccessibilityTester: React.FC<AccessibilityTesterProps> = ({
  selector = '#root',
  autoRun = false,
  showResults = true,
  children
}) => {
  const [issues, setIssues] = useState<AccessibilityIssue[]>([]);
  const [loading, setLoading] = useState(false);
  const [tested, setTested] = useState(false);

  const runTest = async () => {
    setLoading(true);
    try {
      const element = document.querySelector(selector);
      if (!element) {
        console.error(`AccessibilityTester: Element with selector "${selector}" not found`);
        return;
      }

      if (element instanceof HTMLElement) {
        // Run the audit on the DOM element
        const results = await runAccessibilityAudit(element);
        setIssues(results);
      } else {
        console.warn('AccessibilityTester: Selected element is not an HTMLElement');
        setIssues([]);
      }
      
      setTested(true);
    } catch (error) {
      console.error('AccessibilityTester error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoRun) {
      // Wait for content to render
      const timer = setTimeout(() => {
        runTest();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [autoRun, selector]);

  if (!showResults) {
    return <>{children}</>;
  }

  return (
    <div className="accessibility-tester">
      {children}
      
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-0 right-0 p-4 bg-white dark:bg-gray-800 border shadow-lg max-w-md max-h-96 overflow-auto z-50">
          <h3 className="text-lg font-semibold mb-2">Accessibility Check</h3>
          
          <button
            onClick={runTest}
            disabled={loading}
            className="px-3 py-1 bg-blue-500 text-white rounded mb-3 disabled:opacity-50"
          >
            {loading ? 'Running...' : 'Run Test'}
          </button>
          
          {tested && (
            <>
              {issues.length === 0 ? (
                <div className="text-green-500">✓ No issues found</div>
              ) : (
                <div>
                  <div className="text-red-500 mb-2">Found {issues.length} issues:</div>
                  <ul className="list-disc pl-4 space-y-2">
                    {issues.map((issue, i) => (
                      <li key={i}>
                        <div className="font-semibold">
                          {issue.id} ({issue.impact})
                        </div>
                        <div>{issue.description}</div>
                        <a 
                          href={issue.helpUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline text-sm"
                        >
                          Learn more
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AccessibilityTester;
