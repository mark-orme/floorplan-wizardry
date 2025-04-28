
import { renderHook, act } from '@testing-library/react-hooks';
import { useSyncedFloorPlans } from '../useSyncedFloorPlans';
import { vi } from 'vitest';

// Mock API response
const mockFloorPlans = [
  { id: 'plan1', name: 'First Floor', data: { walls: [] } },
  { id: 'plan2', name: 'Second Floor', data: { walls: [] } }
];

// Mock fetch function
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(mockFloorPlans)
  })
) as any;

describe('useSyncedFloorPlans', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('should initialize with empty floor plans array', () => {
    const { result } = renderHook(() => useSyncedFloorPlans({ projectId: '123' }));
    
    expect(result.current.floorPlans).toEqual([]);
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBeNull();
  });
  
  it('should fetch floor plans on mount', async () => {
    const { result, waitForNextUpdate } = renderHook(() => 
      useSyncedFloorPlans({ projectId: '123' })
    );
    
    await waitForNextUpdate();
    
    expect(result.current.floorPlans).toEqual(mockFloorPlans);
    expect(result.current.isLoading).toBe(false);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
  
  it('should handle API errors', async () => {
    global.fetch = vi.fn(() =>
      Promise.reject(new Error('API error'))
    ) as any;
    
    const { result, waitForNextUpdate } = renderHook(() => 
      useSyncedFloorPlans({ projectId: '123' })
    );
    
    await waitForNextUpdate();
    
    expect(result.current.floorPlans).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toEqual('API error');
  });
  
  it('should create a new floor plan', async () => {
    const createMock = vi.fn(() => Promise.resolve({ id: 'new-plan', name: 'New Floor', data: {} }));
    
    const { result, waitForNextUpdate } = renderHook(() => 
      useSyncedFloorPlans({
        projectId: '123',
        customApis: { createFloorPlan: createMock }
      })
    );
    
    await waitForNextUpdate();
    
    act(() => {
      result.current.createFloorPlan('New Floor');
    });
    
    expect(createMock).toHaveBeenCalledWith('123', 'New Floor');
    
    // Wait for state update after creation
    await vi.runAllTimers();
    
    expect(result.current.floorPlans.length).toBe(3);
    expect(result.current.floorPlans[2]).toEqual({ id: 'new-plan', name: 'New Floor', data: {} });
  });
  
  it('should update a floor plan', async () => {
    const updateMock = vi.fn(() => Promise.resolve({ id: 'plan1', name: 'Updated Floor', data: {} }));
    
    const { result, waitForNextUpdate } = renderHook(() => 
      useSyncedFloorPlans({
        projectId: '123',
        customApis: { updateFloorPlan: updateMock }
      })
    );
    
    await waitForNextUpdate();
    
    act(() => {
      result.current.updateFloorPlan('plan1', { name: 'Updated Floor' });
    });
    
    expect(updateMock).toHaveBeenCalledWith('123', 'plan1', { name: 'Updated Floor' });
    
    // Wait for state update after update
    await vi.runAllTimers();
    
    expect(result.current.floorPlans[0].name).toBe('Updated Floor');
  });
  
  it('should delete a floor plan', async () => {
    const deleteMock = vi.fn(() => Promise.resolve({ success: true }));
    
    const { result, waitForNextUpdate } = renderHook(() => 
      useSyncedFloorPlans({
        projectId: '123',
        customApis: { deleteFloorPlan: deleteMock }
      })
    );
    
    await waitForNextUpdate();
    
    act(() => {
      result.current.deleteFloorPlan('plan1');
    });
    
    expect(deleteMock).toHaveBeenCalledWith('123', 'plan1');
    
    // Wait for state update after deletion
    await vi.runAllTimers();
    
    expect(result.current.floorPlans.length).toBe(1);
    expect(result.current.floorPlans[0].id).toBe('plan2');
  });
});
