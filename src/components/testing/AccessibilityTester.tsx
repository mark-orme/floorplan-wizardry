import React, { useState, useEffect } from 'react';
import { axe, toHaveNoViolations } from 'jest-axe';

interface AccessibilityTesterProps {
  /** Whether to show test results */
  showResults: boolean;
  /** Whether to automatically run tests on mount */
  autoRun?: boolean;
  /** Children to test for accessibility */
  children?: React.ReactNode;
}

export const AccessibilityTester: React.FC<AccessibilityTesterProps> = ({ 
  showResults, 
  autoRun = false,
  children 
}) => {
  const [results, setResults] = useState<any>(null);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (autoRun) {
      runTests();
    }
  }, [autoRun]);

  const runTests = async () => {
    if (!children) {
      console.warn('No children to test for accessibility.');
      return;
    }

    setRunning(true);
    try {
      const html = document.body.innerHTML;
      const results = await axe(html, {
        // Configuration options for axe can be added here
      });
      
      setResults(results);
    } catch (error) {
      console.error('Error running accessibility tests:', error);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="accessibility-tester">
      {children}
      {showResults && (
        <div className="test-controls">
          <button onClick={runTests} disabled={running}>
            {running ? 'Running...' : 'Run Tests'}
          </button>
          {results && (
            <div className="test-results">
              {results.violations.length > 0 ? (
                <div>
                  <h3>Accessibility Violations:</h3>
                  <ul>
                    {results.violations.map((violation: any) => (
                      <li key={violation.id}>
                        <strong>{violation.id}:</strong> {violation.help}
                        <a href={violation.helpUrl} target="_blank" rel="noopener noreferrer">
                          Learn more
                        </a>
                        <p>Impact: {violation.impact}</p>
                        <h4>Affected Elements:</h4>
                        <ul>
                          {violation.nodes.map((node: any, index: number) => (
                            <li key={index}>
                              <code>{node.html}</code>
                              <p>Failure Summary: {node.failureSummary}</p>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p>No accessibility violations found!</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
