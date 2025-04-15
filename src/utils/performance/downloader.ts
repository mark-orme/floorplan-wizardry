
/**
 * Performance report download utilities
 * @module utils/performance/downloader
 */
import { saveAs } from 'file-saver';
import { generatePerformanceReport } from './reportGenerator';

/**
 * Download the performance report
 */
export const downloadPerformanceReport = (): void => {
  const reportHtml = generatePerformanceReport();
  const blob = new Blob([reportHtml], { type: 'text/html;charset=utf-8' });
  saveAs(blob, `performance-report-${new Date().toISOString().slice(0, 10)}.html`);
};
