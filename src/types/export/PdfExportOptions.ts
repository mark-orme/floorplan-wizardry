
/**
 * PDF export options type definitions
 * @module types/export/PdfExportOptions
 */

import { CanvasDimensions } from '../core/Geometry';

/**
 * Orientation for PDF export
 */
export type PdfOrientation = 'portrait' | 'landscape';

/**
 * Paper size for PDF export
 */
export type PdfPaperSize = 
  | 'A4'
  | 'A3'
  | 'A2'
  | 'A1'
  | 'A0'
  | 'Letter'
  | 'Legal'
  | 'Tabloid'
  | 'custom';

/**
 * Options for PDF export
 */
export interface PdfExportOptions {
  paperSize: PdfPaperSize;
  dimensions: CanvasDimensions;
  orientation: PdfOrientation;
  scale: number;
  footerText: string;
  includeGrid: boolean;
  includeMeasurements: boolean;
  includeTitleBlock: boolean;
  customWidth?: number;
  customHeight?: number;
  fileName?: string;
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string[];
  compress?: boolean;
  quality?: number;
}

/**
 * Default PDF export options
 */
export const DEFAULT_PDF_EXPORT_OPTIONS: PdfExportOptions = {
  paperSize: 'A4',
  dimensions: { width: 595, height: 842 },
  orientation: 'portrait',
  scale: 1,
  footerText: '',
  includeGrid: true,
  includeMeasurements: true,
  includeTitleBlock: true
};
