
import { useState, useCallback } from 'react';

export interface PaperSize {
  id: string;
  name: string;
  width: number;
  height: number;
  orientation: 'portrait' | 'landscape';
}

const DEFAULT_PAPER_SIZES: PaperSize[] = [
  {
    id: 'a4-portrait',
    name: 'A4',
    width: 595,
    height: 842,
    orientation: 'portrait'
  },
  {
    id: 'a4-landscape',
    name: 'A4',
    width: 842,
    height: 595,
    orientation: 'landscape'
  },
  {
    id: 'letter-portrait',
    name: 'Letter',
    width: 612,
    height: 792,
    orientation: 'portrait'
  },
  {
    id: 'letter-landscape',
    name: 'Letter',
    width: 792,
    height: 612,
    orientation: 'landscape'
  }
];

export const usePaperSizeManager = (initialSizeId: string = 'a4-portrait') => {
  const [paperSizes, setPaperSizes] = useState<PaperSize[]>(DEFAULT_PAPER_SIZES);
  const [currentPaperSizeId, setCurrentPaperSizeId] = useState(initialSizeId);
  const [infiniteCanvas, setInfiniteCanvas] = useState(false);
  
  const getCurrentPaperSize = useCallback(() => {
    return paperSizes.find(size => size.id === currentPaperSizeId) || paperSizes[0];
  }, [paperSizes, currentPaperSizeId]);
  
  const addCustomPaperSize = useCallback((name: string, width: number, height: number) => {
    const orientation = width > height ? 'landscape' : 'portrait';
    const id = `custom-${name.toLowerCase()}-${orientation}-${Date.now()}`;
    
    setPaperSizes(prev => [
      ...prev,
      {
        id,
        name,
        width,
        height,
        orientation
      }
    ]);
    
    return id;
  }, []);
  
  const toggleInfiniteCanvas = useCallback(() => {
    setInfiniteCanvas(prev => !prev);
  }, []);
  
  return {
    paperSizes,
    currentPaperSize: getCurrentPaperSize(),
    setCurrentPaperSizeId,
    addCustomPaperSize,
    infiniteCanvas,
    toggleInfiniteCanvas
  };
};
