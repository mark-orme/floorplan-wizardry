
/**
 * Canvas Component
 * Primary canvas component for fabric.js rendering
 * @module Canvas
 */
import React from 'react';
import { useCanvasInit } from '@/hooks/useCanvasInit';

interface CanvasProps {
  onError?: () => void;
}

/**
 * Canvas component that handles fabric.js canvas rendering
 * @param {CanvasProps} props - Component properties
 * @returns {JSX.Element} Rendered component
 */
export const Canvas: React.FC<CanvasProps> = ({ onError }) => {
  // Initialize canvas with error handling
  useCanvasInit({ onError });
  
  // The actual canvas element is managed by ReliableCanvasContainer
  // This component focuses on initialization logic
  return null;
};
