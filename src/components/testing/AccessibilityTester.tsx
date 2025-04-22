
import React, { useState, useEffect } from 'react';

interface AccessibilityTesterProps {
  autoRun?: boolean;
  showResults?: boolean;
}

export const AccessibilityTester: React.FC<AccessibilityTesterProps> = ({
  autoRun = false,
  showResults = true
}) => {
  const [results, setResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  
  const runTests = () => {
    setIsRunning(true);
    
    // Simulate running accessibility tests
    setTimeout(() => {
      const mockResults = [
        { id: 1, impact: 'critical', description: 'Images must have alt text', nodes: 2 },
        { id: 2, impact: 'serious', description: 'Buttons must have accessible names', nodes: 1 },
        { id: 3, impact: 'minor', description: 'Color contrast should be sufficient', nodes: 3 }
      ];
      
      setResults(mockResults);
      setIsRunning(false);
    }, 1000);
  };
  
  useEffect(() => {
    if (autoRun) {
      runTests();
    }
  }, [autoRun]);
  
  if (!showResults) return null;
  
  return (
    <div className="fixed bottom-0 right-0 p-4 bg-white border rounded-tl-lg shadow-lg max-w-md">
      <h3 className="text-lg font-semibold mb-2">Accessibility Tests</h3>
      
      <button
        className="px-3 py-1 bg-blue-500 text-white rounded mb-2"
        onClick={runTests}
        disabled={isRunning}
      >
        {isRunning ? 'Running...' : 'Run Tests'}
      </button>
      
      {results.length > 0 ? (
        <div className="max-h-40 overflow-y-auto">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="text-left">Impact</th>
                <th className="text-left">Description</th>
                <th className="text-right">Nodes</th>
              </tr>
            </thead>
            <tbody>
              {results.map(result => (
                <tr key={result.id} className="border-t">
                  <td className={`py-1 ${result.impact === 'critical' ? 'text-red-500' : result.impact === 'serious' ? 'text-orange-500' : 'text-yellow-500'}`}>
                    {result.impact}
                  </td>
                  <td className="py-1">{result.description}</td>
                  <td className="py-1 text-right">{result.nodes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-sm text-gray-500">No tests have been run yet.</p>
      )}
    </div>
  );
};
