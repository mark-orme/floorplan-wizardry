
/**
 * PDF export utilities using WebAssembly
 * @module utils/wasm/pdfExport
 */

import { Canvas as FabricCanvas } from 'fabric';
import { generatePdf, wasmStatus, supportsWasm } from './index';
import logger from '@/utils/logger';
import { toast } from 'sonner';

/**
 * Options for PDF export
 */
export interface PdfExportOptions {
  /** Title of the PDF */
  title?: string;
  /** Whether to include a grid */
  includeGrid?: boolean;
  /** Whether to include measurements */
  includeMeasurements?: boolean;
  /** Whether to include a title block */
  includeTitleBlock?: boolean;
  /** Footer text */
  footerText?: string;
  /** Paper size name */
  paperSize?: 'A4' | 'A3' | 'Letter' | 'Legal' | 'Custom';
  /** Width in mm (for custom size) */
  customWidth?: number;
  /** Height in mm (for custom size) */
  customHeight?: number;
  /** Orientation */
  orientation?: 'portrait' | 'landscape';
  /** Scale (1:X) */
  scale?: number;
}

// Paper sizes in points (72 dpi)
const PAPER_SIZES = {
  A4: { width: 595, height: 842 },
  A3: { width: 842, height: 1191 },
  Letter: { width: 612, height: 792 },
  Legal: { width: 612, height: 1008 }
};

/**
 * Export a canvas to PDF
 * @param canvas Fabric.js canvas to export
 * @param options PDF export options
 * @returns ArrayBuffer containing the PDF data
 */
export async function exportCanvasToPdf(
  canvas: FabricCanvas,
  options: PdfExportOptions = {}
): Promise<ArrayBuffer> {
  // Default options
  const {
    title = 'Floor Plan Export',
    includeGrid = true,
    includeMeasurements = true,
    includeTitleBlock = true,
    footerText = '',
    paperSize = 'A4',
    customWidth = 210,
    customHeight = 297,
    orientation = 'portrait',
    scale = 100
  } = options;
  
  // Check if WASM is supported
  if (!supportsWasm()) {
    toast.error('PDF export requires WebAssembly support, which is not available in your browser');
    throw new Error('WebAssembly support required for PDF export');
  }
  
  // Check if PDF module is loaded
  if (!wasmStatus.pdfModuleLoaded) {
    toast.loading('Initializing PDF export module...');
    try {
      // Try to initialize modules
      const { initWasmModules } = await import('./index');
      await initWasmModules();
      
      if (!wasmStatus.pdfModuleLoaded) {
        toast.error('Failed to initialize PDF export module');
        throw new Error('Failed to initialize PDF module');
      }
      
      toast.dismiss();
    } catch (error) {
      toast.error('Failed to initialize PDF export module');
      logger.error('Failed to initialize PDF module:', error);
      throw error;
    }
  }
  
  try {
    // Get paper dimensions
    let width, height;
    
    if (paperSize === 'Custom') {
      // Convert mm to points (1 mm = 2.83465 points)
      width = Math.round(customWidth * 2.83465);
      height = Math.round(customHeight * 2.83465);
    } else {
      ({ width, height } = PAPER_SIZES[paperSize]);
    }
    
    // Apply orientation
    if (orientation === 'landscape') {
      [width, height] = [height, width];
    }
    
    // Get canvas objects
    const objects = canvas.getObjects().filter(obj => {
      // Skip grid objects if includeGrid is false
      if (!includeGrid && (obj as any).objectType === 'grid') {
        return false;
      }
      return true;
    });
    
    // Clone objects to avoid modifying the originals
    const clonedObjects = objects.map(obj => obj.toObject());
    
    // Add title block if requested
    if (includeTitleBlock) {
      // Add title text
      clonedObjects.push({
        type: 'text',
        text: title,
        left: 30,
        top: height - 50,
        fontSize: 16,
        fill: '#000000'
      });
      
      // Add footer text if provided
      if (footerText) {
        clonedObjects.push({
          type: 'text',
          text: footerText,
          left: 30,
          top: height - 30,
          fontSize: 10,
          fill: '#666666'
        });
      }
      
      // Add scale indicator
      clonedObjects.push({
        type: 'text',
        text: `Scale 1:${scale}`,
        left: width - 100,
        top: height - 30,
        fontSize: 10,
        fill: '#666666'
      });
    }
    
    // Generate the PDF
    const pdfData = await generatePdf(clonedObjects, width, height, title);
    
    return pdfData;
  } catch (error) {
    logger.error('Error exporting canvas to PDF:', error);
    toast.error('Error generating PDF');
    throw error;
  }
}

/**
 * Download a PDF file
 * @param pdfData ArrayBuffer containing the PDF data
 * @param filename Name of the file to download
 */
export function downloadPdf(pdfData: ArrayBuffer, filename: string = 'export.pdf'): void {
  // Create a Blob from the PDF data
  const blob = new Blob([pdfData], { type: 'application/pdf' });
  
  // Create a download link
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  
  // Trigger download
  document.body.appendChild(link);
  link.click();
  
  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

/**
 * Export and download a canvas as PDF
 * @param canvas Fabric.js canvas to export
 * @param options PDF export options
 */
export async function exportAndDownloadPdf(
  canvas: FabricCanvas,
  options: PdfExportOptions = {}
): Promise<void> {
  try {
    toast.loading('Generating PDF...');
    
    // Generate the PDF
    const pdfData = await exportCanvasToPdf(canvas, options);
    
    // Download the PDF
    const filename = `${options.title || 'export'}.pdf`;
    downloadPdf(pdfData, filename);
    
    toast.success('PDF downloaded successfully');
  } catch (error) {
    logger.error('Error exporting and downloading PDF:', error);
    toast.error('Failed to generate PDF');
  } finally {
    toast.dismiss();
  }
}
