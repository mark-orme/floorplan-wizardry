
/**
 * Grid management hook (legacy interface)
 * Re-exports functionality from grid-management module for backward compatibility
 * @module useGridManagement
 * @deprecated Use the modular imports from @/hooks/grid-management instead
 */

// Re-export from the new modular structure for backward compatibility
import { useGridManagement as useGridManagementHook } from './grid-management/useGridManagement';
import type { UseGridManagementProps, UseGridManagementResult } from './grid-management/types';

export const useGridManagement = useGridManagementHook;
export type { UseGridManagementProps, UseGridManagementResult };
