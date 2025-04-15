
import React, { useEffect, useState } from 'react';
import { collectPerformanceMetrics } from '@/utils/performance/collector';
import { formatBytes } from '@/utils/performance/resourceUtils';

interface PerformanceBadgeProps {
  showMetrics?: boolean;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  variant?: 'minimal' | 'detailed';
}

/**
 * Performance Badge component
 * Displays performance metrics in the UI
 */
export const PerformanceBadge: React.FC<PerformanceBadgeProps> = ({
  showMetrics = true,
  position = 'bottom-right',
  variant = 'minimal'
}) => {
  const [metrics, setMetrics] = useState<any>(null);
  
  useEffect(() => {
    if (!showMetrics) return;
    
    // Collect metrics after page load
    const timer = setTimeout(() => {
      const collectedMetrics = collectPerformanceMetrics();
      setMetrics(collectedMetrics);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [showMetrics]);
  
  if (!showMetrics || !metrics) return null;
  
  // Position classes
  const positionClasses = {
    'top-right': 'top-2 right-2',
    'top-left': 'top-2 left-2',
    'bottom-right': 'bottom-2 right-2',
    'bottom-left': 'bottom-2 left-2'
  };
  
  // Color based on performance scores
  const getScoreColor = (value: number, good: number, bad: number, inverse = false) => {
    if (inverse) {
      return value < good ? 'text-green-500' : value < bad ? 'text-yellow-500' : 'text-red-500';
    }
    return value > good ? 'text-green-500' : value > bad ? 'text-yellow-500' : 'text-red-500';
  };
  
  return (
    <div className={`fixed ${positionClasses[position]} bg-gray-800/80 text-white rounded-md shadow p-2 z-50 text-xs`}>
      {variant === 'minimal' ? (
        <div className="flex flex-col gap-1">
          <div className="flex justify-between gap-2">
            <span>FCP:</span>
            <span className={getScoreColor(metrics.timeToFirstContentfulPaint, 1800, 3000, true)}>
              {Math.round(metrics.timeToFirstContentfulPaint)}ms
            </span>
          </div>
          <div className="flex justify-between gap-2">
            <span>Resources:</span>
            <span className={getScoreColor(metrics.resourceStats.totalRequests, 30, 50, true)}>
              {metrics.resourceStats.totalRequests}
            </span>
          </div>
          <div className="flex justify-between gap-2">
            <span>Size:</span>
            <span className={getScoreColor(metrics.resourceStats.totalSize / 1024, 1000, 2000, true)}>
              {formatBytes(metrics.resourceStats.totalSize)}
            </span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="font-bold border-b border-gray-600 pb-1">Performance Metrics</div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            <span>First Paint:</span>
            <span className={getScoreColor(metrics.timeToFirstPaint, 1000, 2500, true)}>
              {Math.round(metrics.timeToFirstPaint)}ms
            </span>
            
            <span>First Contentful Paint:</span>
            <span className={getScoreColor(metrics.timeToFirstContentfulPaint, 1800, 3000, true)}>
              {Math.round(metrics.timeToFirstContentfulPaint)}ms
            </span>
            
            <span>DOM Content Loaded:</span>
            <span className={getScoreColor(metrics.domContentLoaded, 2000, 4000, true)}>
              {Math.round(metrics.domContentLoaded)}ms
            </span>
            
            <span>Load Complete:</span>
            <span className={getScoreColor(metrics.loadComplete, 3000, 6000, true)}>
              {Math.round(metrics.loadComplete)}ms
            </span>
            
            <span>Total Requests:</span>
            <span className={getScoreColor(metrics.resourceStats.totalRequests, 30, 50, true)}>
              {metrics.resourceStats.totalRequests}
            </span>
            
            <span>Total Size:</span>
            <span className={getScoreColor(metrics.resourceStats.totalSize / 1024, 1000, 2000, true)}>
              {formatBytes(metrics.resourceStats.totalSize)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
