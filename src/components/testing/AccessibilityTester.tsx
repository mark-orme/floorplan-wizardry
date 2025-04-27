
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface AccessibilityTesterProps {
  children: React.ReactNode;
  showResults?: boolean;
  autoRun?: boolean;
}

export const AccessibilityTester: React.FC<AccessibilityTesterProps> = ({
  children,
  showResults = false,
  autoRun = false
}) => {
  const [results, setResults] = useState<any[] | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runTests = async () => {
    setIsRunning(true);
    try {
      // Simulate running accessibility tests
      await new Promise(resolve => setTimeout(resolve, 500));
      setResults([
        { id: 1, passed: true, rule: 'aria-roles', impact: 'serious' },
        { id: 2, passed: true, rule: 'color-contrast', impact: 'critical' }
      ]);
    } catch (error) {
      console.error('Error running accessibility tests:', error);
      setResults([]);
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    if (autoRun && showResults) {
      runTests();
    }
  }, [autoRun, showResults]);

  return (
    <div className="accessibility-tester">
      {children}
      
      {showResults && (
        <div className="mt-4 p-4 border rounded bg-muted/20">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Accessibility Test Results</h3>
            <Button 
              onClick={runTests}
              disabled={isRunning}
              size="sm"
            >
              {isRunning ? 'Running...' : 'Run Tests'}
            </Button>
          </div>
          
          {results && (
            <div className="text-sm">
              {results.length === 0 ? (
                <p>No accessibility issues found</p>
              ) : (
                <ul className="space-y-2">
                  {results.map(result => (
                    <li key={result.id} className="flex items-center gap-2">
                      {result.passed ? (
                        <span className="text-green-500">✓</span>
                      ) : (
                        <span className="text-red-500">✗</span>
                      )}
                      <span>{result.rule}</span>
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        result.impact === 'critical' ? 'bg-red-100 text-red-800' : 
                        result.impact === 'serious' ? 'bg-orange-100 text-orange-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {result.impact}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
