
import { useCallback, useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';

interface UseGridMonitoringProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  gridObjectsRef: React.MutableRefObject<any[]>;
  onGridIssue?: (issue: string) => void;
}

export const useGridMonitoring = ({
  fabricCanvasRef,
  gridObjectsRef,
  onGridIssue
}: UseGridMonitoringProps) => {
  const [gridStatus, setGridStatus] = useState<'ok' | 'warning' | 'error'>('ok');
  const monitoringIntervalRef = useRef<number | null>(null);
  
  // Check for grid rendering issues
  const checkGridHealth = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    const gridObjects = gridObjectsRef.current;
    
    if (!canvas || !gridObjects.length) {
      setGridStatus('error');
      if (onGridIssue) onGridIssue('No grid found');
      return;
    }
    
    // Check if all grid objects are present and have correct bounds
    let allObjectsVisible = true;
    let allObjectsHaveBounds = true;
    
    gridObjects.forEach(obj => {
      if (obj && !canvas.contains(obj)) {
        allObjectsVisible = false;
      }
      
      // Check if the getBoundingRect method exists before calling it
      if (obj && obj.getBoundingRect) {
        const bounds = obj.getBoundingRect();
        if (!bounds || bounds.width === 0 || bounds.height === 0) {
          allObjectsHaveBounds = false;
        }
      } else {
        allObjectsHaveBounds = false;
      }
    });
    
    if (!allObjectsVisible) {
      setGridStatus('error');
      if (onGridIssue) onGridIssue('Some grid objects are missing');
    } else if (!allObjectsHaveBounds) {
      setGridStatus('warning');
      if (onGridIssue) onGridIssue('Some grid objects have invalid bounds');
    } else {
      setGridStatus('ok');
    }
  }, [fabricCanvasRef, gridObjectsRef, onGridIssue]);
  
  // Set up monitoring interval
  useEffect(() => {
    // Initial check
    checkGridHealth();
    
    // Set up interval for periodic checks
    monitoringIntervalRef.current = window.setInterval(checkGridHealth, 10000);
    
    return () => {
      if (monitoringIntervalRef.current !== null) {
        clearInterval(monitoringIntervalRef.current);
      }
    };
  }, [checkGridHealth]);
  
  return {
    gridStatus,
    checkGridHealth
  };
};
