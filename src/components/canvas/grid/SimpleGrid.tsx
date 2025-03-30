
import React, { useEffect, useState } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { SimpleGridClass } from './SimpleGridClass';
import { Button } from '@/components/ui/button';
import { Grid, X } from 'lucide-react';

/**
 * Props for SimpleGrid component
 */
interface SimpleGridProps {
  canvas: FabricCanvas;
  showControls?: boolean;
  defaultVisible?: boolean;
  onGridCreated?: (objects: FabricObject[]) => void;
}

/**
 * SimpleGrid React component wrapper
 * Creates and manages a grid on the canvas
 * @param props Component props
 * @returns {JSX.Element} Rendered component
 */
export const SimpleGrid: React.FC<SimpleGridProps> = ({
  canvas,
  showControls = false,
  defaultVisible = true,
  onGridCreated
}) => {
  const [visible, setVisible] = useState(defaultVisible);
  const [gridInstance, setGridInstance] = useState<SimpleGridClass | null>(null);
  
  // Create grid on canvas mount
  useEffect(() => {
    if (!canvas) return;
    
    // Initialize grid
    const grid = new SimpleGridClass({
      canvas,
      showControls,
      defaultVisible
    });
    
    setGridInstance(grid);
    
    // Call the callback if provided
    if (onGridCreated) {
      onGridCreated(grid.getObjects());
    }
    
    // Clean up grid on unmount
    return () => {
      grid.destroy();
    };
  }, [canvas]);
  
  // Update grid visibility when visible state changes
  useEffect(() => {
    if (!gridInstance) return;
    
    if (visible) {
      gridInstance.show();
    } else {
      gridInstance.hide();
    }
  }, [visible, gridInstance]);
  
  // Don't render anything if no canvas or controls aren't shown
  if (!showControls) return null;
  
  return (
    <div className="absolute bottom-4 right-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setVisible(!visible)}
        title={visible ? "Hide Grid" : "Show Grid"}
      >
        {visible ? <X className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
      </Button>
    </div>
  );
};
