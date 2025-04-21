
import React, { useEffect, useState } from 'react';
import { 
  runAccessibilityCheck, 
  checkColorContrast, 
  validateAriaAttributes,
  AccessibilityIssue,
  loadAccessibilityTester
} from '@/utils/testing/accessibilityTester';

interface AccessibilityTesterProps {
  selector?: string;
  autoRun?: boolean;
  showResults?: boolean;
}

export const AccessibilityTester: React.FC<AccessibilityTesterProps> = ({
  selector = '#root',
  autoRun = false,
  showResults = process.env.NODE_ENV === 'development'
}) => {
  const [issues, setIssues] = useState<AccessibilityIssue[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  // Load the accessibility tester
  useEffect(() => {
    let mounted = true;
    
    loadAccessibilityTester()
      .then(() => {
        if (mounted) {
          setIsLoaded(true);
          console.log('Accessibility tester loaded');
          
          if (autoRun) {
            runTest();
          }
        }
      })
      .catch(error => {
        console.error('Failed to load accessibility tester:', error);
      });
      
    return () => {
      mounted = false;
    };
  }, [autoRun]);

  // Run the accessibility test
  const runTest = async () => {
    if (!isLoaded || isRunning) return;
    
    setIsRunning(true);
    
    try {
      const element = document.querySelector(selector);
      if (!element) {
        console.error(`Element not found: ${selector}`);
        return;
      }
      
      const results = await runAccessibilityCheck(element as HTMLElement);
      setIssues(results);
      
      // Log results to console in a test-friendly format
      console.group('Accessibility Test Results');
      console.log(`Found ${results.length} issues`);
      results.forEach(issue => {
        console.groupCollapsed(`${issue.impact.toUpperCase()}: ${issue.description}`);
        console.log(`WCAG: ${issue.id}`);
        console.log(`Help: ${issue.help}`);
        console.log(`More info: ${issue.helpUrl}`);
        console.log('Affected nodes:');
        issue.nodes.forEach(node => {
          console.log(node.html);
          console.log(node.failureSummary);
        });
        console.groupEnd();
      });
      console.groupEnd();
      
    } catch (error) {
      console.error('Error running accessibility test:', error);
    } finally {
      setIsRunning(false);
    }
  };

  // Group issues by impact
  const criticalIssues = issues.filter(issue => issue.impact === 'critical');
  const seriousIssues = issues.filter(issue => issue.impact === 'serious');
  const moderateIssues = issues.filter(issue => issue.impact === 'moderate');
  const minorIssues = issues.filter(issue => issue.impact === 'minor');

  if (!showResults) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-md">
      <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200 text-sm">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-bold text-gray-800">Accessibility Tester</h2>
          <button
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            onClick={runTest}
            disabled={!isLoaded || isRunning}
          >
            {isRunning ? 'Testing...' : 'Run Test'}
          </button>
        </div>
        
        {issues.length > 0 ? (
          <div className="max-h-80 overflow-y-auto">
            <div className="grid grid-cols-4 gap-2 mb-2">
              <div className="bg-red-100 rounded px-2 py-1 text-center">
                <span className="text-red-800 font-bold">{criticalIssues.length}</span>
                <div className="text-xs text-red-600">Critical</div>
              </div>
              <div className="bg-orange-100 rounded px-2 py-1 text-center">
                <span className="text-orange-800 font-bold">{seriousIssues.length}</span>
                <div className="text-xs text-orange-600">Serious</div>
              </div>
              <div className="bg-yellow-100 rounded px-2 py-1 text-center">
                <span className="text-yellow-800 font-bold">{moderateIssues.length}</span>
                <div className="text-xs text-yellow-600">Moderate</div>
              </div>
              <div className="bg-blue-100 rounded px-2 py-1 text-center">
                <span className="text-blue-800 font-bold">{minorIssues.length}</span>
                <div className="text-xs text-blue-600">Minor</div>
              </div>
            </div>
            
            <div className="space-y-2">
              {criticalIssues.concat(seriousIssues).slice(0, 3).map((issue, index) => (
                <div key={index} className="bg-gray-50 p-2 rounded border-l-4 border-red-500">
                  <div className="font-medium text-gray-800">{issue.description}</div>
                  <div className="text-xs text-gray-500">{issue.help}</div>
                  <a 
                    href={issue.helpUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-blue-500 hover:underline"
                  >
                    Learn more
                  </a>
                </div>
              ))}
              
              {issues.length > 3 && (
                <div className="text-xs text-gray-500 text-center">
                  ... and {issues.length - 3} more issues
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            {isLoaded ? (
              isRunning ? 'Running tests...' : 'No issues found. Run a test to check for problems.'
            ) : (
              'Loading accessibility tester...'
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AccessibilityTester;
