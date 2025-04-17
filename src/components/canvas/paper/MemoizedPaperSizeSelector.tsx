
import React, { useMemo } from 'react';

// Define the PaperSize interface locally to fix the import error
interface PaperSize {
  id: string;
  name: string;
  width: number;
  height: number;
}

interface MemoizedPaperSizeSelectorProps {
  currentPaperSize: PaperSize;
  paperSizes: PaperSize[];
  infiniteCanvas: boolean;
  onChangePaperSize: (size: PaperSize | string) => void; // Updated to accept either PaperSize or string
  onToggleInfiniteCanvas: () => void;
}

export const MemoizedPaperSizeSelector = React.memo<MemoizedPaperSizeSelectorProps>(({
  currentPaperSize,
  paperSizes,
  infiniteCanvas,
  onChangePaperSize,
  onToggleInfiniteCanvas
}) => {
  // Memoize the formatted size options
  const sizeOptions = useMemo(() => 
    paperSizes.map(size => ({
      ...size,
      label: `${size.name} (${size.width}×${size.height})`
    }))
  , [paperSizes]);
  
  // Memoize the current size ID
  const currentSizeId = useMemo(() => 
    infiniteCanvas ? 'infinite' : `${currentPaperSize.width}x${currentPaperSize.height}`
  , [infiniteCanvas, currentPaperSize]);
  
  return (
    <div className="absolute bottom-4 left-4 bg-white/80 rounded-md shadow-md px-2 py-1 z-10">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium">Paper Size:</span>
          <select
            className="text-xs border border-gray-300 rounded px-1 py-0.5 bg-white"
            value={currentSizeId}
            onChange={(e) => {
              const val = e.target.value;
              if (val === 'infinite') {
                onToggleInfiniteCanvas();
              } else {
                const size = paperSizes.find(s => 
                  `${s.width}x${s.height}` === val
                );
                if (size) onChangePaperSize(size);
              }
            }}
          >
            <option value="infinite">Infinite Canvas</option>
            {sizeOptions.map(size => (
              <option 
                key={`${size.width}x${size.height}`}
                value={`${size.width}x${size.height}`}
              >
                {size.label}
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
              onChange={onToggleInfiniteCanvas}
            />
            Infinite Canvas
          </label>
        </div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Deep comparison for paper sizes
  const isSameCurrentSize = 
    prevProps.currentPaperSize.width === nextProps.currentPaperSize.width &&
    prevProps.currentPaperSize.height === nextProps.currentPaperSize.height;
  
  // Only re-render if infinite canvas changes or current size changes
  return prevProps.infiniteCanvas === nextProps.infiniteCanvas && 
         isSameCurrentSize &&
         prevProps.paperSizes.length === nextProps.paperSizes.length;
});

MemoizedPaperSizeSelector.displayName = 'MemoizedPaperSizeSelector';

export default MemoizedPaperSizeSelector;
