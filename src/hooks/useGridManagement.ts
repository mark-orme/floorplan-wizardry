
/**
 * Grid management hook (legacy interface)
 * Re-exports functionality from grid-management module for backward compatibility
 * @module useGridManagement
 * @deprecated Use the modular imports from @/hooks/grid-management instead
 */

// Re-export everything from the new modular structure for backward compatibility
export { useGridManagement } from './grid-management';
export type { UseGridManagementProps, UseGridManagementResult } from './grid-management';
