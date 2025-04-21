
/**
 * PDF export utilities using WebAssembly
 * @module utils/wasm/pdfExport
 */

import { Canvas as FabricCanvas } from 'fabric';
import { generatePdf } from './index';
import logger from '@/utils/logger';

/**
 * PDF export options
 */
export interface PdfExportOptions {
  /** Title of the PDF */
  title?: string;
  /** Filename for downloading the PDF */
  filename?: string;
  /** Paper size in points (72dpi) */
  paperSize?: {
    width: number;
    height: number;
  };
  /** Include only visible objects */
  onlyVisible?: boolean;
  /** Margin in points (72dpi) */
  margin?: number;
  /** Custom width for custom paper size */
  customWidth?: number;
  /** Custom height for custom paper size */
  customHeight?: number;
  /** Page orientation (portrait or landscape) */
  orientation?: 'portrait' | 'landscape';
  /** Scale factor for the PDF */
  scale?: number;
  /** Footer text to display on the PDF */
  footerText?: string;
  /** Whether to include grid in the exported PDF */
  includeGrid?: boolean;
  /** Whether to include measurements in the exported PDF */
  includeMeasurements?: boolean;
  /** Whether to include a title block in the exported PDF */
  includeTitleBlock?: boolean;
}

/**
 * Export canvas to PDF
 * @param canvas Fabric.js canvas
 * @param options PDF export options
 * @returns ArrayBuffer containing the PDF data
 */
export async function exportCanvasToPdf(
  canvas: FabricCanvas,
  options: PdfExportOptions = {}
): Promise<ArrayBuffer> {
  try {
    // Default options
    const {
      title = 'Floor Plan Export',
      paperSize = { width: 595, height: 842 }, // A4 in points
      onlyVisible = true,
      margin = 20
    } = options;
    
    // Get canvas objects
    const objects = canvas.getObjects().filter(obj => {
      return !onlyVisible || obj.visible !== false;
    });
    
    // Canvas dimensions
    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();
    
    // Available space after margins
    const availableWidth = paperSize.width - (margin * 2);
    const availableHeight = paperSize.height - (margin * 2);
    
    // Calculate scale to fit canvas in PDF
    const scaleX = availableWidth / canvasWidth;
    const scaleY = availableHeight / canvasHeight;
    const scale = Math.min(scaleX, scaleY, 1); // Don't scale up, only down
    
    // Transform objects for PDF
    const pdfObjects = objects.map(obj => {
      const objJson = obj.toObject();
      
      // Apply scale and position adjustments
      objJson.left = (objJson.left * scale) + margin;
      objJson.top = (objJson.top * scale) + margin;
      
      // Scale dimensions
      if (objJson.width) objJson.width *= scale;
      if (objJson.height) objJson.height *= scale;
      if (objJson.radius) objJson.radius *= scale;
      if (objJson.strokeWidth) objJson.strokeWidth *= scale;
      
      // Scale path/points if present
      if (objJson.path) {
        objJson.path = objJson.path.map(point => ({
          x: (point.x * scale) + margin,
          y: (point.y * scale) + margin
        }));
      }
      
      if (objJson.points) {
        objJson.points = objJson.points.map(point => ({
          x: (point.x * scale) + margin,
          y: (point.y * scale) + margin
        }));
      }
      
      return objJson;
    });
    
    // Generate PDF
    const pdfData = await generatePdf(
      pdfObjects,
      paperSize.width,
      paperSize.height,
      title
    );
    
    return pdfData;
  } catch (error) {
    logger.error('Error exporting canvas to PDF:', error);
    throw new Error('Failed to export canvas to PDF');
  }
}

/**
 * Export canvas to PDF and trigger download
 * @param canvas Fabric.js canvas
 * @param options PDF export options
 */
export async function exportAndDownloadPdf(
  canvas: FabricCanvas,
  options: PdfExportOptions = {}
): Promise<void> {
  try {
    const pdfData = await exportCanvasToPdf(canvas, options);
    
    // Default filename
    const { filename = 'floor-plan.pdf' } = options;
    
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
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    logger.error('Error downloading PDF:', error);
    throw new Error('Failed to download PDF');
  }
}
