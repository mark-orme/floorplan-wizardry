
/**
 * PDF Export Settings Component
 * @module components/canvas/export/PdfExportSettings
 */

import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { PdfExportOptions } from '@/utils/wasm/pdfExport';
import { Canvas as FabricCanvas } from 'fabric';
import { useWasmPdfExport } from '@/hooks/useWasmPdfExport';
import { toast } from 'sonner';

interface PdfExportSettingsProps {
  /** Whether the dialog is open */
  open: boolean;
  /** Callback when the dialog's open state changes */
  onOpenChange: (open: boolean) => void;
  /** Canvas to export */
  canvas: FabricCanvas | null;
}

/**
 * PDF Export Settings Dialog
 */
export const PdfExportSettings: React.FC<PdfExportSettingsProps> = ({
  open,
  onOpenChange,
  canvas
}) => {
  // Default export options
  const [exportOptions, setExportOptions] = useState<PdfExportOptions>({
    title: 'Floor Plan Export',
    includeGrid: true,
    includeMeasurements: true,
    includeTitleBlock: true,
    footerText: '',
    paperSize: 'A4',
    orientation: 'portrait',
    scale: 100
  });
  
  // Use our PDF export hook
  const { exporting, error, isSupported, downloadPdf } = useWasmPdfExport();
  
  // Handle PDF export
  const handleExport = async () => {
    if (!canvas) {
      toast.error('Canvas not available');
      return;
    }
    
    if (!isSupported) {
      toast.error('PDF export requires WebAssembly support, which is not available in your browser');
      return;
    }
    
    try {
      await downloadPdf(canvas, exportOptions);
      onOpenChange(false);
    } catch (e) {
      // Error is already handled in the hook
      console.error('PDF export error:', e);
    }
  };
  
  // Handle option changes
  const handleOptionChange = (key: keyof PdfExportOptions, value: any) => {
    setExportOptions(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Export as PDF</DialogTitle>
          <DialogDescription>
            Configure PDF export settings
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {!isSupported && (
            <div className="bg-amber-50 text-amber-800 p-3 rounded-md mb-3">
              WebAssembly support is required for PDF export but is not available in your browser.
            </div>
          )}
          
          {/* Title */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={exportOptions.title}
              onChange={(e) => handleOptionChange('title', e.target.value)}
              className="col-span-3"
            />
          </div>
          
          {/* Paper Size */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="paperSize" className="text-right">
              Paper Size
            </Label>
            <Select
              value={exportOptions.paperSize}
              onValueChange={(value: any) => handleOptionChange('paperSize', value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select paper size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A4">A4</SelectItem>
                <SelectItem value="A3">A3</SelectItem>
                <SelectItem value="Letter">Letter</SelectItem>
                <SelectItem value="Legal">Legal</SelectItem>
                <SelectItem value="Custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Custom size (if selected) */}
          {exportOptions.paperSize === 'Custom' && (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="customWidth" className="text-right">
                  Width (mm)
                </Label>
                <Input
                  id="customWidth"
                  type="number"
                  value={exportOptions.customWidth || 210}
                  onChange={(e) => handleOptionChange('customWidth', Number(e.target.value))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="customHeight" className="text-right">
                  Height (mm)
                </Label>
                <Input
                  id="customHeight"
                  type="number"
                  value={exportOptions.customHeight || 297}
                  onChange={(e) => handleOptionChange('customHeight', Number(e.target.value))}
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
              value={exportOptions.orientation}
              onValueChange={(value: any) => handleOptionChange('orientation', value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select orientation" />
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
              Scale 1:
            </Label>
            <Input
              id="scale"
              type="number"
              value={exportOptions.scale}
              onChange={(e) => handleOptionChange('scale', Number(e.target.value))}
              className="col-span-3"
            />
          </div>
          
          {/* Footer Text */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="footerText" className="text-right">
              Footer Text
            </Label>
            <Input
              id="footerText"
              value={exportOptions.footerText}
              onChange={(e) => handleOptionChange('footerText', e.target.value)}
              className="col-span-3"
            />
          </div>
          
          {/* Checkboxes */}
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="col-span-4 space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeGrid"
                  checked={exportOptions.includeGrid}
                  onCheckedChange={(checked) => 
                    handleOptionChange('includeGrid', Boolean(checked))
                  }
                />
                <Label htmlFor="includeGrid">Include Grid</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeMeasurements"
                  checked={exportOptions.includeMeasurements}
                  onCheckedChange={(checked) => 
                    handleOptionChange('includeMeasurements', Boolean(checked))
                  }
                />
                <Label htmlFor="includeMeasurements">Include Measurements</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeTitleBlock"
                  checked={exportOptions.includeTitleBlock}
                  onCheckedChange={(checked) => 
                    handleOptionChange('includeTitleBlock', Boolean(checked))
                  }
                />
                <Label htmlFor="includeTitleBlock">Include Title Block</Label>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleExport} 
            disabled={!canvas || exporting || !isSupported}
          >
            {exporting ? 'Exporting...' : 'Export PDF'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
