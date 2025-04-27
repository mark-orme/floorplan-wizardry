
import React, { useState } from 'react';
import { 
  FileTextIcon, 
  Maximize2Icon,
  ChevronDownIcon 
} from 'lucide-react';
import { PaperSize } from '@/hooks/usePaperSizeManager';

interface PaperSizeSelectorProps {
  currentPaperSize: PaperSize;
  paperSizes: PaperSize[];
  infiniteCanvas: boolean;
  onChangePaperSize: (sizeId: string) => void;
  onToggleInfiniteCanvas: () => void;
}

export const PaperSizeSelector: React.FC<PaperSizeSelectorProps> = ({
  currentPaperSize,
  paperSizes,
  infiniteCanvas,
  onChangePaperSize,
  onToggleInfiniteCanvas
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="absolute top-4 left-32 z-10">
      <div className="relative">
        <button
          className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-md shadow-md px-3 py-1 text-sm"
          onClick={() => setIsOpen(!isOpen)}
        >
          {infiniteCanvas ? (
            <>
              <Maximize2Icon className="h-4 w-4" />
              <span>Infinite Canvas</span>
            </>
          ) : (
            <>
              <FileTextIcon className="h-4 w-4" />
              <span>
                {currentPaperSize.name} ({currentPaperSize.orientation})
              </span>
            </>
          )}
          <ChevronDownIcon className="h-3 w-3" />
        </button>
        
        {isOpen && (
          <div className="absolute top-full left-0 mt-1 bg-white rounded-md shadow-md py-1 w-48">
            <button
              className="w-full px-3 py-1 text-left text-sm flex items-center gap-2 hover:bg-gray-100"
              onClick={() => {
                onToggleInfiniteCanvas();
                setIsOpen(false);
              }}
            >
              <Maximize2Icon className="h-4 w-4" />
              {infiniteCanvas ? 'Switch to Paper Size' : 'Switch to Infinite Canvas'}
            </button>
            
            <div className="h-px bg-gray-200 my-1" />
            
            {!infiniteCanvas && (
              <>
                <div className="px-3 py-1 text-xs text-gray-500">Paper Sizes:</div>
                {paperSizes.map(size => (
                  <button
                    key={size.id}
                    className={`w-full px-3 py-1 text-left text-sm hover:bg-gray-100 ${
                      currentPaperSize.id === size.id ? 'font-medium bg-blue-50' : ''
                    }`}
                    onClick={() => {
                      onChangePaperSize(size.id);
                      setIsOpen(false);
                    }}
                  >
                    {size.name} ({size.orientation})
                  </button>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
