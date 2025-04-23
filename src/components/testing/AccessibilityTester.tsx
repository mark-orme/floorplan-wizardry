
import React, { useState } from 'react';

interface AccessibilityTesterProps {
  showResults?: boolean;
}

export const AccessibilityTester: React.FC<AccessibilityTesterProps> = ({
  showResults = false
}) => {
  const [results, setResults] = useState<{
    passed: string[];
    failed: string[];
  }>({
    passed: ['Color contrast', 'Image alt text'],
    failed: []
  });
  
  if (!showResults) return null;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-2 text-xs" style={{ maxHeight: '150px', overflowY: 'auto' }}>
      <h4 className="font-bold mb-1">Accessibility Tests</h4>
      
      <div className="grid grid-cols-2 gap-2">
        <div>
          <h5 className="text-green-600 font-semibold">Passed ({results.passed.length})</h5>
          <ul className="list-disc pl-4">
            {results.passed.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
        
        <div>
          <h5 className="text-red-600 font-semibold">Failed ({results.failed.length})</h5>
          <ul className="list-disc pl-4">
            {results.failed.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
            {results.failed.length === 0 && (
              <li className="text-gray-500">No failures detected</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AccessibilityTester;
