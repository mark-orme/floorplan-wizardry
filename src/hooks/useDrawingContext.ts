
import { useContext } from 'react';
import { DrawingContext } from '@/contexts/DrawingContext';

export const useDrawingContext = () => {
  const context = useContext(DrawingContext);
  
  if (context === undefined) {
    throw new Error('useDrawingContext must be used within a DrawingProvider');
  }
  
  return context;
};
