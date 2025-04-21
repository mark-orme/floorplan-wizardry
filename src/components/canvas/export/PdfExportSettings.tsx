
import React, { useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { usePdfExport } from '@/hooks/export/usePdfExport';
import { PdfExportOptions } from '@/utils/wasm/pdfExport';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { PaperSize } from '@/types/core/floor-plan';

interface PdfExportSettingsProps {
  canvas: FabricCanvas | null;
  onExportComplete?: () => void;
}

const paperSizes = [
  { id: 'a4', name: 'A4', width: 595, height: 842 },
  { id: 'a3', name: 'A3', width: 842, height: 1191 },
  { id: 'letter', name: 'Letter', width: 612, height: 792 },
  { id: 'legal', name: 'Legal', width: 612, height: 1008 },
  { id: 'custom', name: 'Custom', width: 0, height: 0 },
];

interface PdfFormValues {
  filename: string;
  paperSize: string;
  orientation: 'portrait' | 'landscape';
  margin: number;
  customWidth?: number;
  customHeight?: number;
  includeGrid: boolean;
  includeMeasurements: boolean;
  includeTitleBlock: boolean;
  title: string;
  footerText: string;
}

export const PdfExportSettings: React.FC<PdfExportSettingsProps> = ({
  canvas,
  onExportComplete
}) => {
  const [loading, setLoading] = useState(false);
  
  const pdfExport = usePdfExport();
  
  const form = useForm<PdfFormValues>({
    defaultValues: {
      filename: 'floor-plan.pdf',
      paperSize: 'a4',
      orientation: 'portrait',
      margin: 20,
      includeGrid: false,
      includeMeasurements: true,
      includeTitleBlock: true,
      title: 'Floor Plan',
      footerText: 'Generated with Floor Plan Editor'
    }
  });
  
  const isCustomPaperSize = form.watch('paperSize') === 'custom';
  
  const handleExport = async (values: PdfFormValues) => {
    if (!canvas) {
      toast.error('Canvas not available');
      return;
    }
    
    if (!pdfExport.initialized) {
      toast.error('PDF export not initialized');
      return;
    }
    
    if (!pdfExport.supported) {
      toast.error('PDF export not supported in this browser');
      return;
    }
    
    try {
      setLoading(true);
      
      // Get selected paper size
      const selectedPaperSize = paperSizes.find(size => size.id === values.paperSize);
      
      if (!selectedPaperSize && !isCustomPaperSize) {
        toast.error('Invalid paper size');
        return;
      }
      
      // Create export options
      const options: PdfExportOptions = {
        filename: values.filename,
        title: values.title,
        footerText: values.footerText,
        orientation: values.orientation,
        margin: values.margin,
        includeGrid: values.includeGrid,
        includeMeasurements: values.includeMeasurements,
        includeTitleBlock: values.includeTitleBlock
      };
      
      // Set paper size based on selection
      if (isCustomPaperSize && values.customWidth && values.customHeight) {
        options.customWidth = values.customWidth;
        options.customHeight = values.customHeight;
      } else if (selectedPaperSize) {
        options.paperSize = {
          width: selectedPaperSize.width,
          height: selectedPaperSize.height
        };
        
        // Swap width and height for landscape
        if (values.orientation === 'landscape') {
          options.paperSize = {
            width: selectedPaperSize.height,
            height: selectedPaperSize.width
          };
        }
      }
      
      // Download the PDF
      await pdfExport.downloadPdf(canvas, options);
      
      toast.success('PDF exported successfully');
      
      if (onExportComplete) {
        onExportComplete();
      }
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error(`Failed to export PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };
  
  if (pdfExport.error) {
    return (
      <div className="p-4 bg-red-50 text-red-800 rounded-md">
        <h3 className="font-medium text-red-900">PDF Export Error</h3>
        <p>{pdfExport.error}</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4 max-w-md mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleExport)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Floor Plan" />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="filename"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Filename</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="floor-plan.pdf" />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="paperSize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Paper Size</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a paper size" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {paperSizes.map((size) => (
                      <SelectItem key={size.id} value={size.id}>{size.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          
          {isCustomPaperSize && (
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="customWidth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Width (pts)</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min="1" placeholder="Width" />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="customHeight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Height (pts)</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min="1" placeholder="Height" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          )}
          
          <FormField
            control={form.control}
            name="orientation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Orientation</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select orientation" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="portrait">Portrait</SelectItem>
                    <SelectItem value="landscape">Landscape</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="includeGrid"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>Include Grid</FormLabel>
                  <FormDescription>
                    Show the grid in the exported PDF
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="includeMeasurements"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>Include Measurements</FormLabel>
                  <FormDescription>
                    Show measurements in the exported PDF
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full" disabled={pdfExport.loading || loading}>
            {(pdfExport.loading || loading) ? 'Exporting...' : 'Export PDF'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default PdfExportSettings;
