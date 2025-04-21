
/**
 * PDF Export Settings component
 * @module components/canvas/export/PdfExportSettings
 */

import React, { useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useWasmPdfExport } from '@/hooks/useWasmPdfExport';
import { toast } from 'sonner';

interface PdfExportSettingsProps {
  /** Canvas to export */
  canvas: FabricCanvas | null;
  /** Dialog open state */
  open: boolean;
  /** Dialog open state change handler */
  onOpenChange: (open: boolean) => void;
}

// Define paper size options
const paperSizes = {
  'a4': { width: 595, height: 842 },
  'a3': { width: 842, height: 1191 },
  'letter': { width: 612, height: 792 },
  'legal': { width: 612, height: 1008 },
  'custom': { width: 0, height: 0 } // Placeholder for custom size
};

type PaperSizeKey = keyof typeof paperSizes;

/**
 * PDF Export Settings Dialog
 */
export const PdfExportSettings: React.FC<PdfExportSettingsProps> = ({
  canvas,
  open,
  onOpenChange
}) => {
  // Export options
  const [options, setOptions] = useState({
    filename: 'floor-plan.pdf',
    paperSize: paperSizes['a4'],
    onlyVisible: true,
    margin: 20,
    customWidth: 500,
    customHeight: 700,
    orientation: 'portrait' as 'portrait' | 'landscape',
    scale: 1,
    footerText: '',
    includeGrid: false,
    includeMeasurements: true,
    includeTitleBlock: false
  });
  
  // Selected paper size key
  const [selectedSize, setSelectedSize] = useState<PaperSizeKey>('a4');
  
  // PDF export hook
  const { 
    exporting, 
    error, 
    isSupported, 
    downloadPdf 
  } = useWasmPdfExport();
  
  // Handle option change
  const handleOptionChange = <K extends keyof typeof options>(
    key: K, 
    value: typeof options[K]
  ) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };
  
  // Handle paper size change
  const handlePaperSizeChange = (size: PaperSizeKey) => {
    setSelectedSize(size);
    
    if (size === 'custom') {
      // Use custom dimensions
      setOptions(prev => ({
        ...prev,
        paperSize: {
          width: prev.customWidth,
          height: prev.customHeight
        }
      }));
    } else {
      // Use predefined dimensions
      let paperSize = { ...paperSizes[size] };
      
      // Swap dimensions for landscape orientation
      if (options.orientation === 'landscape') {
        paperSize = {
          width: paperSize.height,
          height: paperSize.width
        };
      }
      
      setOptions(prev => ({
        ...prev,
        paperSize
      }));
    }
  };
  
  // Handle orientation change
  const handleOrientationChange = (orientation: 'portrait' | 'landscape') => {
    const newOrientation = orientation;
    
    // Don't swap dimensions for custom size
    if (selectedSize !== 'custom') {
      // Swap dimensions
      const paperSize = {
        width: options.paperSize.height,
        height: options.paperSize.width
      };
      
      setOptions(prev => ({
        ...prev,
        paperSize,
        orientation: newOrientation
      }));
    } else {
      setOptions(prev => ({
        ...prev,
        orientation: newOrientation
      }));
    }
  };
  
  // Handle custom width change
  const handleCustomWidthChange = (width: number) => {
    setOptions(prev => ({
      ...prev,
      customWidth: width,
      paperSize: {
        ...prev.paperSize,
        width
      }
    }));
  };
  
  // Handle custom height change
  const handleCustomHeightChange = (height: number) => {
    setOptions(prev => ({
      ...prev,
      customHeight: height,
      paperSize: {
        ...prev.paperSize,
        height
      }
    }));
  };
  
  // Handle scale change
  const handleScaleChange = (scale: number) => {
    setOptions(prev => ({
      ...prev,
      scale
    }));
  };
  
  // Handle footer text change
  const handleFooterTextChange = (text: string) => {
    setOptions(prev => ({
      ...prev,
      footerText: text
    }));
  };
  
  // Handle grid toggle
  const handleGridToggle = (include: boolean) => {
    setOptions(prev => ({
      ...prev,
      includeGrid: include
    }));
  };
  
  // Handle measurements toggle
  const handleMeasurementsToggle = (include: boolean) => {
    setOptions(prev => ({
      ...prev,
      includeMeasurements: include
    }));
  };
  
  // Handle title block toggle
  const handleTitleBlockToggle = (include: boolean) => {
    setOptions(prev => ({
      ...prev,
      includeTitleBlock: include
    }));
  };
  
  // Handle export
  const handleExport = async () => {
    if (!canvas) {
      toast.error('Canvas not available');
      return;
    }
    
    if (!isSupported) {
      toast.error('WebAssembly support is required for PDF export');
      return;
    }
    
    try {
      await downloadPdf(canvas, options);
      toast.success('PDF exported successfully');
      onOpenChange(false);
    } catch (err) {
      console.error('PDF export error:', err);
      toast.error('Failed to export PDF');
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export PDF</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {!isSupported && (
            <div className="p-2 text-red-500 bg-red-50 rounded border border-red-200">
              WebAssembly support is required for PDF export, but it's not available in your browser.
            </div>
          )}
          
          {error && (
            <div className="p-2 text-red-500 bg-red-50 rounded border border-red-200">
              Error: {error.message}
            </div>
          )}
          
          {/* Filename */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="filename" className="text-right">
              Filename
            </Label>
            <Input
              id="filename"
              value={options.filename}
              onChange={(e) => handleOptionChange('filename', e.target.value)}
              className="col-span-3"
            />
          </div>
          
          {/* Paper size */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="paperSize" className="text-right">
              Paper Size
            </Label>
            <Select
              value={selectedSize}
              onValueChange={(value) => handlePaperSizeChange(value as PaperSizeKey)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="a4">A4</SelectItem>
                <SelectItem value="a3">A3</SelectItem>
                <SelectItem value="letter">Letter</SelectItem>
                <SelectItem value="legal">Legal</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Custom dimensions (only shown for custom size) */}
          {selectedSize === 'custom' && (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="customWidth" className="text-right">
                  Width (pt)
                </Label>
                <Input
                  id="customWidth"
                  type="number"
                  value={options.customWidth}
                  onChange={(e) => handleCustomWidthChange(Number(e.target.value))}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="customHeight" className="text-right">
                  Height (pt)
                </Label>
                <Input
                  id="customHeight"
                  type="number"
                  value={options.customHeight}
                  onChange={(e) => handleCustomHeightChange(Number(e.target.value))}
                  className="col-span-3"
                />
              </div>
            </>
          )}
          
          {/* Orientation */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="orientation" className="text-right">
              Orientation
            </Label>
            <Select
              value={options.orientation}
              onValueChange={(value) => handleOrientationChange(value as 'portrait' | 'landscape')}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Orientation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="portrait">Portrait</SelectItem>
                <SelectItem value="landscape">Landscape</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Scale */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="scale" className="text-right">
              Scale: {options.scale.toFixed(2)}x
            </Label>
            <div className="col-span-3">
              <Slider
                id="scale"
                min={0.1}
                max={2}
                step={0.05}
                value={[options.scale]}
                onValueChange={([value]) => handleScaleChange(value)}
              />
            </div>
          </div>
          
          {/* Footer text */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="footerText" className="text-right">
              Footer Text
            </Label>
            <Input
              id="footerText"
              value={options.footerText}
              onChange={(e) => handleFooterTextChange(e.target.value)}
              className="col-span-3"
            />
          </div>
          
          {/* Include grid */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="includeGrid" className="text-right">
              Include Grid
            </Label>
            <div className="flex items-center space-x-2">
              <Switch
                id="includeGrid"
                checked={options.includeGrid}
                onCheckedChange={handleGridToggle}
              />
            </div>
          </div>
          
          {/* Include measurements */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="includeMeasurements" className="text-right">
              Include Measurements
            </Label>
            <div className="flex items-center space-x-2">
              <Switch
                id="includeMeasurements"
                checked={options.includeMeasurements}
                onCheckedChange={handleMeasurementsToggle}
              />
            </div>
          </div>
          
          {/* Include title block */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="includeTitleBlock" className="text-right">
              Include Title Block
            </Label>
            <div className="flex items-center space-x-2">
              <Switch
                id="includeTitleBlock"
                checked={options.includeTitleBlock}
                onCheckedChange={handleTitleBlockToggle}
              />
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button 
            type="button" 
            onClick={handleExport} 
            disabled={exporting || !isSupported}
          >
            {exporting ? 'Exporting...' : 'Export'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
