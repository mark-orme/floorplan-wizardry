
/**
 * PDF Export Settings Component
 * Allows users to configure PDF export options
 */
import React from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { exportCanvasToPdf } from '@/utils/wasm/pdfExport';

export interface PdfExportSettingsProps {
  canvas: FabricCanvas;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PdfExportSettings: React.FC<PdfExportSettingsProps> = ({ 
  canvas,
  open,
  onOpenChange
}) => {
  const [filename, setFilename] = React.useState('floor-plan.pdf');
  const [paperSize, setPaperSize] = React.useState('a4');
  const [orientation, setOrientation] = React.useState('portrait');
  const [includeGrid, setIncludeGrid] = React.useState(true);
  const [includeMeasurements, setIncludeMeasurements] = React.useState(true);
  const [isExporting, setIsExporting] = React.useState(false);
  
  const handleExport = async () => {
    try {
      setIsExporting(true);
      
      // Configure paper size dimensions in points (72dpi)
      let width, height;
      switch (paperSize) {
        case 'a3':
          width = 842;
          height = 1191;
          break;
        case 'a4':
          width = 595;
          height = 842;
          break;
        case 'letter':
          width = 612;
          height = 792;
          break;
        default:
          width = 595;
          height = 842;
      }
      
      // Swap dimensions for landscape orientation
      if (orientation === 'landscape') {
        [width, height] = [height, width];
      }
      
      // Export to PDF
      const pdfData = await exportCanvasToPdf(canvas, {
        filename,
        paperSize: { width, height },
        includeGrid,
        includeMeasurements
      });
      
      // Create blob and URL
      const blob = new Blob([pdfData], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      // Create download link
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.style.display = 'none';
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      // Close dialog
      onOpenChange(false);
    } catch (error) {
      console.error('Error exporting PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export to PDF</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="filename" className="text-right">
              Filename
            </Label>
            <Input
              id="filename"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="paperSize" className="text-right">
              Paper Size
            </Label>
            <Select
              value={paperSize}
              onValueChange={setPaperSize}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select paper size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="a4">A4</SelectItem>
                <SelectItem value="a3">A3</SelectItem>
                <SelectItem value="letter">Letter</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="orientation" className="text-right">
              Orientation
            </Label>
            <Select
              value={orientation}
              onValueChange={setOrientation}
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
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="includeGrid" className="text-right">
              Include Grid
            </Label>
            <div className="flex items-center space-x-2 col-span-3">
              <Checkbox
                id="includeGrid"
                checked={includeGrid}
                onCheckedChange={(checked) => 
                  setIncludeGrid(checked === true)
                }
              />
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="includeMeasurements" className="text-right">
              Include Measurements
            </Label>
            <div className="flex items-center space-x-2 col-span-3">
              <Checkbox
                id="includeMeasurements"
                checked={includeMeasurements}
                onCheckedChange={(checked) => 
                  setIncludeMeasurements(checked === true)
                }
              />
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? 'Exporting...' : 'Export'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PdfExportSettings;
