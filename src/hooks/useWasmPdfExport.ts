
/**
 * Hook for WebAssembly-accelerated PDF export
 * @module hooks/useWasmPdfExport
 */

import { useState, useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { 
  exportCanvasToPdf, 
  exportAndDownloadPdf, 
  PdfExportOptions 
} from '@/utils/wasm/pdfExport';
import { wasmStatus, supportsWasm } from '@/utils/wasm';
import logger from '@/utils/logger';

/**
 * Hook for WebAssembly-accelerated PDF export
 * @returns PDF export utility functions and status information
 */
export function useWasmPdfExport() {
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Generate PDF from canvas
  const generatePdf = useCallback(async (
    canvas: FabricCanvas, 
    options: PdfExportOptions = {}
  ) => {
    if (!supportsWasm()) {
      const error = new Error('WebAssembly support required for PDF export');
      setError(error);
      return Promise.reject(error);
    }
    
    setExporting(true);
    setError(null);
    
    try {
      const pdfData = await exportCanvasToPdf(canvas, options);
      return pdfData;
    } catch (err) {
      logger.error('Error generating PDF:', err);
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setExporting(false);
    }
  }, []);
  
  // Generate and download PDF
  const downloadPdf = useCallback(async (
    canvas: FabricCanvas, 
    options: PdfExportOptions = {}
  ) => {
    if (!supportsWasm()) {
      const error = new Error('WebAssembly support required for PDF export');
      setError(error);
      return Promise.reject(error);
    }
    
    setExporting(true);
    setError(null);
    
    try {
      await exportAndDownloadPdf(canvas, options);
    } catch (err) {
      logger.error('Error downloading PDF:', err);
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setExporting(false);
    }
  }, []);
  
  return {
    // Status
    exporting,
    error,
    isSupported: supportsWasm() && wasmStatus.pdfModuleLoaded,
    
    // PDF export functions
    generatePdf,
    downloadPdf,
  };
}
