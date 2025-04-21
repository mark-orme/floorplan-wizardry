
/**
 * Hook for using WASM PDF export operations
 * @module hooks/useWasmPdfExport
 */

import { useState, useEffect, useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { wasmStatus, initWasm } from '@/utils/wasm';
import { exportCanvasToPdf, exportAndDownloadPdf, PdfExportOptions } from '@/utils/wasm/pdfExport';
import logger from '@/utils/logger';

/**
 * Hook for WASM-powered PDF exports
 * @returns An object with WASM PDF export utilities
 */
export function useWasmPdfExport() {
  const [initialized, setInitialized] = useState(wasmStatus.loaded);
  const [loading, setLoading] = useState(!wasmStatus.loaded);
  const [error, setError] = useState<string | null>(wasmStatus.error ? wasmStatus.errorMessage : null);

  // Initialize WASM module
  useEffect(() => {
    if (wasmStatus.loaded) {
      setInitialized(true);
      setLoading(false);
      return;
    }

    async function loadWasm() {
      try {
        setLoading(true);
        const success = await initWasm();
        setInitialized(success);
        setLoading(false);

        if (!success) {
          setError('Failed to initialize WASM module');
          logger.warn('WASM initialization failed, falling back to JS', { category: 'wasm' });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
        setLoading(false);
        logger.error('Error initializing WASM module', { category: 'wasm', error: err });
      }
    }

    loadWasm();
  }, []);

  /**
   * Export canvas to PDF 
   * @param canvas Fabric.js canvas
   * @param options Export options
   * @returns PDF data as ArrayBuffer
   */
  const exportToPdf = useCallback(async (
    canvas: FabricCanvas, 
    options?: PdfExportOptions
  ): Promise<ArrayBuffer> => {
    if (!wasmStatus.loaded) {
      logger.warn('WASM not loaded for PDF export, may use fallback', { category: 'wasm' });
    }
    
    try {
      return await exportCanvasToPdf(canvas, options);
    } catch (err) {
      logger.error('Error exporting canvas to PDF', { category: 'wasm', error: err });
      throw err;
    }
  }, []);

  /**
   * Export canvas to PDF and trigger download
   * @param canvas Fabric.js canvas
   * @param options Export options
   */
  const downloadPdf = useCallback(async (
    canvas: FabricCanvas, 
    options?: PdfExportOptions
  ): Promise<void> => {
    if (!wasmStatus.loaded) {
      logger.warn('WASM not loaded for PDF export, may use fallback', { category: 'wasm' });
    }
    
    try {
      await exportAndDownloadPdf(canvas, options);
    } catch (err) {
      logger.error('Error downloading PDF', { category: 'wasm', error: err });
      throw err;
    }
  }, []);

  return {
    initialized,
    loading,
    error,
    supported: wasmStatus.supported,
    exportToPdf,
    downloadPdf
  };
}

export default useWasmPdfExport;
