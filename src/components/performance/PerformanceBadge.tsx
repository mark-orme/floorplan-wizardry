
import React, { useState, useEffect } from 'react';
import { Download, BarChart2 } from 'lucide-react';
import { downloadPerformanceReport } from '@/utils/performanceReporter';

/**
 * Performance badge component
 * Shows load time and bundle size information
 */
export const PerformanceBadge: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [loadTime, setLoadTime] = useState<number | null>(null);
  const [bundleSize, setBundleSize] = useState<number | null>(null);
  
  useEffect(() => {
    // Wait for page to fully load
    if (document.readyState === 'complete') {
      measurePerformance();
    } else {
      window.addEventListener('load', measurePerformance);
      return () => window.removeEventListener('load', measurePerformance);
    }
  }, []);
  
  const measurePerformance = () => {
    // Calculate load time
    const perfEntries = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (perfEntries) {
      setLoadTime(Math.round(perfEntries.loadEventEnd));
    }
    
    // Estimate bundle size from resource entries
    const jsEntries = performance.getEntriesByType('resource')
      .filter(entry => entry.name.endsWith('.js'));
    
    if (jsEntries.length > 0) {
      const totalSize = jsEntries.reduce((sum, entry) => sum + (entry.transferSize || 0), 0);
      setBundleSize(Math.round(totalSize / 1024)); // KB
    }
    
    // Show badge after measurement
    setIsVisible(true);
  };
  
  // Badge colors based on performance
  const getLoadTimeColor = (ms: number) => {
    if (ms < 1000) return 'bg-green-500';
    if (ms < 3000) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  const getBundleSizeColor = (kb: number) => {
    if (kb < 300) return 'bg-green-500';
    if (kb < 800) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  if (!isVisible) return null;
  
  return (
    <div 
      className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex items-center bg-white dark:bg-gray-800 rounded-full shadow-lg px-2 py-1 text-xs z-50 border border-gray-200 dark:border-gray-700"
      title="Performance metrics"
    >
      <div className="flex items-center mr-3">
        <BarChart2 size={14} className="mr-1 text-gray-500" />
        <span className="text-gray-700 dark:text-gray-300 font-medium">Performance</span>
      </div>
      
      {loadTime !== null && (
        <div className="flex items-center mr-2" title="Page load time">
          <div className={`w-2 h-2 rounded-full ${getLoadTimeColor(loadTime)} mr-1`}></div>
          <span>{loadTime}ms</span>
        </div>
      )}
      
      {bundleSize !== null && (
        <div className="flex items-center mr-2" title="JavaScript bundle size">
          <div className={`w-2 h-2 rounded-full ${getBundleSizeColor(bundleSize)} mr-1`}></div>
          <span>{bundleSize}KB</span>
        </div>
      )}
      
      <button 
        className="ml-1 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded" 
        title="Download performance report"
        onClick={downloadPerformanceReport}
      >
        <Download size={12} className="text-gray-500" />
      </button>
    </div>
  );
};
