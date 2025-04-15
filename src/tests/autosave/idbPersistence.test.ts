
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { saveCanvasToIDB, loadCanvasFromIDB, clearCanvasFromIDB } from '@/utils/storage/idbMockCanvas';

// Mock the idb module
vi.mock('idb', () => ({
  openDB: vi.fn(() => ({
    put: vi.fn((storeName, value, key) => Promise.resolve(key)),
    get: vi.fn((storeName, key) => {
      if (key === 'testKey') {
        return Promise.resolve({ objects: [{ type: 'circle' }] });
      }
      return Promise.resolve(null);
    }),
    delete: vi.fn(() => Promise.resolve()),
    getAll: vi.fn(() => Promise.resolve([])),
    getAllKeys: vi.fn(() => Promise.resolve([]))
  }))
}));

describe('Mocked IDB autosave', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    
    // Reset all mocks
    vi.clearAllMocks();
  });
  
  afterEach(() => {
    // Clean up after tests
    localStorage.clear();
  });
  
  it('should save canvas state to idb', async () => {
    const canvasData = { objects: [{ type: 'rect', width: 100, height: 100 }] };
    const result = await saveCanvasToIDB('testKey', canvasData);
    
    expect(result).toBe(true);
    
    // Verify it was saved to localStorage (our mock implementation)
    const saved = localStorage.getItem('testKey');
    expect(saved).not.toBeNull();
    
    const parsed = JSON.parse(saved!);
    expect(parsed.objects[0].type).toBe('rect');
  });

  it('should load canvas state from idb', async () => {
    // First save some data
    localStorage.setItem('testKey', JSON.stringify({ 
      objects: [{ type: 'circle', radius: 50 }] 
    }));
    
    // Then load it
    const data = await loadCanvasFromIDB('testKey');
    
    expect(data).not.toBeNull();
    expect(data.objects[0].type).toBe('circle');
    expect(data.objects[0].radius).toBe(50);
  });
  
  it('should return null when loading non-existent key', async () => {
    const data = await loadCanvasFromIDB('nonExistentKey');
    expect(data).toBeNull();
  });
  
  it('should clear canvas state from idb', async () => {
    // First save some data
    localStorage.setItem('testKey', JSON.stringify({ objects: [] }));
    
    // Then clear it
    const result = await clearCanvasFromIDB('testKey');
    
    expect(result).toBe(true);
    expect(localStorage.getItem('testKey')).toBeNull();
  });
  
  it('should handle errors gracefully', async () => {
    // Mock localStorage.setItem to throw an error
    const originalSetItem = localStorage.setItem;
    
    try {
      localStorage.setItem = vi.fn(() => {
        throw new Error('Storage quota exceeded');
      });
      
      const result = await saveCanvasToIDB('errorKey', { objects: [] });
      expect(result).toBe(false);
    } finally {
      // Restore original implementation
      localStorage.setItem = originalSetItem;
    }
  });
});
