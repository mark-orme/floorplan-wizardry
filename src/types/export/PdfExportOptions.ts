
/**
 * PDF Export Options
 * Configuration options for PDF exports
 */
import { CanvasDimensions } from '@/types/core/Geometry';

/**
 * PDF page sizes in points (1/72 inch)
 */
export enum PdfPageSize {
  A4 = 'a4',
  A3 = 'a3',
  LETTER = 'letter',
  LEGAL = 'legal',
  CUSTOM = 'custom'
}

/**
 * PDF orientation
 */
export enum PdfOrientation {
  PORTRAIT = 'portrait',
  LANDSCAPE = 'landscape'
}

/**
 * PDF export options
 */
export interface PdfExportOptions {
  /**
   * Page size
   */
  pageSize: PdfPageSize;
  
  /**
   * Page orientation
   */
  orientation: PdfOrientation;
  
  /**
   * Custom page dimensions (when pageSize is CUSTOM)
   */
  customDimensions?: CanvasDimensions;
  
  /**
   * PDF title
   */
  title?: string;
  
  /**
   * Include measurements
   */
  includeMeasurements?: boolean;
  
  /**
   * Include room labels
   */
  includeRoomLabels?: boolean;
  
  /**
   * Include scale indicator
   */
  includeScale?: boolean;
  
  /**
   * Scale value (e.g., 1:100)
   */
  scale?: number;
  
  /**
   * Include grid
   */
  includeGrid?: boolean;
  
  /**
   * Include legend
   */
  includeLegend?: boolean;
  
  /**
   * Include creation date
   */
  includeDate?: boolean;
  
  /**
   * High quality rendering
   */
  highQuality?: boolean;
  
  /**
   * Include metadata
   */
  includeMetadata?: boolean;
  
  /**
   * Margin in points
   */
  margin?: number;
}

/**
 * Default PDF export options
 */
export const DEFAULT_PDF_EXPORT_OPTIONS: PdfExportOptions = {
  pageSize: PdfPageSize.A4,
  orientation: PdfOrientation.LANDSCAPE,
  title: 'Floor Plan',
  includeMeasurements: true,
  includeRoomLabels: true,
  includeScale: true,
  scale: 100, // 1:100
  includeGrid: false,
  includeLegend: true,
  includeDate: true,
  highQuality: true,
  includeMetadata: true,
  margin: 36 // 0.5 inch
};
