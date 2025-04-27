
import React from 'react';
import { Button } from '@/components/ui/button';

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
  const [results, setResults] = React.useState<any[]>([]);

  const runTests = React.useCallback(() => {
    // Mock accessibility test implementation
    console.log('Running accessibility tests');
    setResults([
      { id: 1, rule: 'aria-labels', status: 'pass' },
      { id: 2, rule: 'color-contrast', status: 'pass' }
    ]);
  }, []);
  
  React.useEffect(() => {
    if (autoRun) {
      runTests();
    }
  }, [autoRun, runTests]);

  return (
    <div className="relative">
      {children}
      
      {showResults && (
        <div className="mt-4 p-4 border rounded-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Accessibility Results</h2>
            <Button onClick={runTests}>Run Tests</Button>
          </div>
          
          {results.length > 0 ? (
            <ul className="space-y-2">
              {results.map(result => (
                <li key={result.id} className="flex items-center gap-2">
                  <span className={result.status === 'pass' ? 'text-green-500' : 'text-red-500'}>
                    {result.status === 'pass' ? '✓' : '✗'}
                  </span>
                  <span>{result.rule}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No tests have been run yet.</p>
          )}
        </div>
      )}
    </div>
  );
};
