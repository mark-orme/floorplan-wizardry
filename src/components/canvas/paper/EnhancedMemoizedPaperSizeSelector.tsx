
import React, { useCallback, useMemo } from 'react';

// Define the PaperSize interface
interface PaperSize {
  id: string;
  name: string;
  width: number;
  height: number;
}

interface EnhancedMemoizedPaperSizeSelectorProps {
  currentPaperSize: PaperSize;
  paperSizes: PaperSize[];
  infiniteCanvas: boolean;
  onChangePaperSize: (size: PaperSize | string) => void;
  onToggleInfiniteCanvas: () => void;
}

/**
 * Highly optimized paper size selector component
 * Uses memoization and prevents unnecessary re-renders
 */
export const EnhancedMemoizedPaperSizeSelector = React.memo<EnhancedMemoizedPaperSizeSelectorProps>(({
  currentPaperSize,
  paperSizes,
  infiniteCanvas,
  onChangePaperSize,
  onToggleInfiniteCanvas
}) => {
  // Memoize the formatted size options
  const sizeOptions = useMemo(() => 
    paperSizes.map(size => ({
      value: `${size.width}x${size.height}`,
      label: `${size.name} (${size.width}×${size.height})`,
      size
    }))
  , [paperSizes]);
  
  // Memoize the current size ID
  const currentSizeId = useMemo(() => 
    infiniteCanvas ? 'infinite' : `${currentPaperSize.width}x${currentPaperSize.height}`
  , [infiniteCanvas, currentPaperSize.width, currentPaperSize.height]);
  
  // Create memoized event handlers to prevent unnecessary re-renders
  const handleSizeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'infinite') {
      onToggleInfiniteCanvas();
    } else {
      const size = sizeOptions.find(option => option.value === val)?.size;
      if (size) onChangePaperSize(size);
    }
  }, [sizeOptions, onToggleInfiniteCanvas, onChangePaperSize]);
  
  const handleInfiniteToggle = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onToggleInfiniteCanvas();
  }, [onToggleInfiniteCanvas]);
  
  return (
    <div className="absolute bottom-4 left-4 bg-white/80 rounded-md shadow-md px-2 py-1 z-10">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium">Paper Size:</span>
          <select
            className="text-xs border border-gray-300 rounded px-1 py-0.5 bg-white"
            value={currentSizeId}
            onChange={handleSizeChange}
          >
            <option value="infinite">Infinite Canvas</option>
            {sizeOptions.map(option => (
              <option 
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1 text-xs">
            <input
              type="checkbox"
              className="h-3 w-3"
              checked={infiniteCanvas}
              onChange={handleInfiniteToggle}
            />
            Infinite Canvas
          </label>
        </div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom equality function to prevent unnecessary re-renders
  // Only re-render if these specific props change
  const isSameCurrentSize = 
    prevProps.currentPaperSize.width === nextProps.currentPaperSize.width &&
    prevProps.currentPaperSize.height === nextProps.currentPaperSize.height &&
    prevProps.currentPaperSize.id === nextProps.currentPaperSize.id;
  
  const isSamePaperSizes = 
    prevProps.paperSizes.length === nextProps.paperSizes.length;
    
  return (
    isSameCurrentSize &&
    isSamePaperSizes &&
    prevProps.infiniteCanvas === nextProps.infiniteCanvas
  );
});

EnhancedMemoizedPaperSizeSelector.displayName = 'EnhancedMemoizedPaperSizeSelector';

export default EnhancedMemoizedPaperSizeSelector;
