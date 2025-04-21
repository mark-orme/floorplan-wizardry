
/**
 * PDF Export Hook
 * Provides functions for exporting canvas to PDF
 */

import { useState, useEffect } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { exportCanvasToPdf, exportAndDownloadPdf, PdfExportOptions } from '@/utils/wasm/pdfExport';
import logger from '@/utils/logger';

interface UsePdfExportResult {
  /**
   * Whether WASM has been initialized 
   */
  initialized: boolean;
  
  /**
   * Whether export is currently loading
   */
  loading: boolean;
  
  /**
   * Error message if any
   */
  error: string;
  
  /**
   * Whether PDF export is supported in this environment
   */
  supported: boolean;
  
  /**
   * Export canvas to PDF
   */
  exportToPdf: (canvas: FabricCanvas, options?: PdfExportOptions) => Promise<ArrayBuffer>;
  
  /**
   * Export canvas to PDF and trigger download
   */
  downloadPdf: (canvas: FabricCanvas, options?: PdfExportOptions) => Promise<void>;
}

/**
 * Hook for PDF export functionality
 */
export function usePdfExport(): UsePdfExportResult {
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      setSupported(false);
      setError('PDF export is not supported in this environment');
      return;
    }
    
    // Check if WebAssembly is supported
    if (typeof WebAssembly !== 'object') {
      setSupported(false);
      setError('WebAssembly is not supported in this browser');
      return;
    }
    
    setInitialized(true);
  }, []);

  /**
   * Export canvas to PDF
   */
  const exportToPdf = async (canvas: FabricCanvas, options?: PdfExportOptions): Promise<ArrayBuffer> => {
    if (!initialized) {
      throw new Error('PDF export not initialized');
    }
    
    if (!supported) {
      throw new Error('PDF export not supported in this environment');
    }
    
    try {
      setLoading(true);
      setError('');
      return await exportCanvasToPdf(canvas, options);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error exporting to PDF';
      setError(errorMessage);
      logger.error('Error exporting to PDF:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Export canvas to PDF and trigger download
   */
  const downloadPdf = async (canvas: FabricCanvas, options?: PdfExportOptions): Promise<void> => {
    if (!initialized) {
      throw new Error('PDF export not initialized');
    }
    
    if (!supported) {
      throw new Error('PDF export not supported in this environment');
    }
    
    try {
      setLoading(true);
      setError('');
      await exportAndDownloadPdf(canvas, options);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error downloading PDF';
      setError(errorMessage);
      logger.error('Error downloading PDF:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    initialized,
    loading,
    error,
    supported,
    exportToPdf,
    downloadPdf
  };
}
