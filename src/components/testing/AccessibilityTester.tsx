
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface AccessibilityTesterProps {
  showResults: boolean;
  autoRun?: boolean;
  children?: React.ReactNode;
}

export const AccessibilityTester: React.FC<AccessibilityTesterProps> = ({ 
  showResults, 
  autoRun = false,
  children 
}) => {
  const [results, setResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  
  const runTests = () => {
    setIsRunning(true);
    
    // Simulate accessibility tests
    setTimeout(() => {
      setResults([
        { id: 1, type: 'warning', message: 'Missing alt text on image' },
        { id: 2, type: 'error', message: 'Color contrast is insufficient' },
        { id: 3, type: 'info', message: 'Landmarks are properly used' }
      ]);
      setIsRunning(false);
    }, 1000);
  };
  
  // Auto-run tests when component mounts if autoRun is true
  useEffect(() => {
    if (autoRun) {
      runTests();
    }
  }, [autoRun]);
  
  return (
    <div className="accessibility-tester">
      {children}
      
      {showResults && (
        <div className="mt-4 border p-4 rounded">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium">Accessibility Tests</h3>
            <Button 
              onClick={runTests} 
              size="sm"
              disabled={isRunning}
            >
              {isRunning ? 'Running...' : 'Run Tests'}
            </Button>
          </div>
          
          {results.length > 0 ? (
            <ul className="space-y-2">
              {results.map(result => (
                <li 
                  key={result.id} 
                  className={`p-2 rounded ${
                    result.type === 'error' ? 'bg-red-100' : 
                    result.type === 'warning' ? 'bg-amber-100' : 'bg-blue-100'
                  }`}
                >
                  <span className="font-medium">{result.type}: </span>
                  {result.message}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">
              {isRunning 
                ? 'Running tests...' 
                : 'Click the button to run accessibility tests'}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
