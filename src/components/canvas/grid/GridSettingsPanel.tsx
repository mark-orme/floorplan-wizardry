import React, { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ColorPicker } from '@/components/ui/color-picker';
import { useDrawingContext } from '@/contexts/DrawingContext';
import { SMALL_GRID_SIZE, LARGE_GRID_SIZE } from '@/constants/gridConstants';

interface GridSettingsPanelProps {
  onClose?: () => void;
}

export const GridSettingsPanel: React.FC<GridSettingsPanelProps> = ({ onClose }) => {
  const { showGrid, setShowGrid } = useDrawingContext();
  
  const [gridSize, setGridSize] = useState(SMALL_GRID_SIZE);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [showMajorGrid, setShowMajorGrid] = useState(true);
  const [gridColor, setGridColor] = useState('#cccccc');
  const [majorGridColor, setMajorGridColor] = useState('#999999');
  
  useEffect(() => {
    // Load saved grid settings from localStorage
    const savedSettings = localStorage.getItem('gridSettings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setGridSize(settings.gridSize || SMALL_GRID_SIZE);
        setSnapToGrid(settings.snapToGrid !== undefined ? settings.snapToGrid : true);
        setShowMajorGrid(settings.showMajorGrid !== undefined ? settings.showMajorGrid : true);
        setGridColor(settings.gridColor || '#cccccc');
        setMajorGridColor(settings.majorGridColor || '#999999');
      } catch (e) {
        console.error('Error loading grid settings:', e);
      }
    }
  }, []);
  
  const saveSettings = () => {
    const settings = {
      gridSize,
      snapToGrid,
      showMajorGrid,
      gridColor,
      majorGridColor
    };
    
    localStorage.setItem('gridSettings', JSON.stringify(settings));
    
    if (onClose) {
      onClose();
    }
  };
  
  const handleGridSizeChange = (newSize: number | undefined) => {
    setGridSize(newSize ?? 20); // Use nullish coalescing to provide a default value
    
    // Update grid in real-time
    // This would typically call a function to redraw the grid
    // with the new size
  };
  
  const resetToDefaults = () => {
    setGridSize(SMALL_GRID_SIZE);
    setSnapToGrid(true);
    setShowMajorGrid(true);
    setGridColor('#cccccc');
    setMajorGridColor('#999999');
  };
  
  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Grid Settings</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          ✕
        </Button>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="show-grid">Show Grid</Label>
          <Switch 
            id="show-grid" 
            checked={showGrid} 
            onCheckedChange={setShowGrid} 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="grid-size">Grid Size: {gridSize}px</Label>
          <Slider
            id="grid-size"
            min={5}
            max={100}
            step={5}
            value={[gridSize]}
            onValueChange={(values) => handleGridSizeChange(values[0])}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="snap-to-grid">Snap to Grid</Label>
          <Switch 
            id="snap-to-grid" 
            checked={snapToGrid} 
            onCheckedChange={setSnapToGrid} 
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="show-major-grid">Show Major Grid Lines</Label>
          <Switch 
            id="show-major-grid" 
            checked={showMajorGrid} 
            onCheckedChange={setShowMajorGrid} 
          />
        </div>
        
        <div className="space-y-2">
          <Label>Grid Color</Label>
          <div className="flex items-center gap-2">
            <div 
              className="w-8 h-8 border rounded" 
              style={{ backgroundColor: gridColor }}
            />
            <Input 
              value={gridColor} 
              onChange={(e) => setGridColor(e.target.value)} 
              className="w-28"
            />
            <ColorPicker 
              color={gridColor} 
              onChange={setGridColor} 
            />
          </div>
        </div>
        
        {showMajorGrid && (
          <div className="space-y-2">
            <Label>Major Grid Color</Label>
            <div className="flex items-center gap-2">
              <div 
                className="w-8 h-8 border rounded" 
                style={{ backgroundColor: majorGridColor }}
              />
              <Input 
                value={majorGridColor} 
                onChange={(e) => setMajorGridColor(e.target.value)} 
                className="w-28"
              />
              <ColorPicker 
                color={majorGridColor} 
                onChange={setMajorGridColor} 
              />
            </div>
          </div>
        )}
      </div>
      
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={resetToDefaults}>
          Reset to Defaults
        </Button>
        <Button onClick={saveSettings}>
          Apply Changes
        </Button>
      </div>
    </div>
  );
};

export default GridSettingsPanel;
