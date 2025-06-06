
import { vi } from 'vitest';

export const useSyncedFloorPlans = () => ({
  floorPlans: [],
  isLoading: false,
  error: null,
  refreshFloorPlans: vi.fn(),
  createFloorPlan: vi.fn(),
  updateFloorPlan: vi.fn(),
  deleteFloorPlan: vi.fn(),
  syncFloorPlan: vi.fn(),
  isSyncing: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false
});
