
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { saveCanvasHistory, loadCanvasHistory, clearCanvasHistory } from '@/utils/storage/historyStorage';

// Mock IndexedDB
vi.mock('idb', () => ({
  openDB: vi.fn(() => ({
    put: vi.fn(async (store, value, key) => {
      localStorage.setItem(`${store}_${key}`, JSON.stringify(value));
      return key;
    }),
    get: vi.fn(async (store, key) => {
      const value = localStorage.getItem(`${store}_${key}`);
      return value ? JSON.parse(value) : null;
    }),
    delete: vi.fn(async (store, key) => {
      localStorage.removeItem(`${store}_${key}`);
    })
  }))
}));

describe('Canvas History Storage', () => {
  const testKey = 'test-history-key';
  const testData = ['state1', 'state2', 'state3'];
  
  beforeEach(() => {
    localStorage.clear();
  });
  
  afterEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('saves canvas history to storage', async () => {
    await saveCanvasHistory(testKey, testData);
    const storedValue = localStorage.getItem(`history_${testKey}`);
    expect(storedValue).not.toBeNull();
    expect(JSON.parse(storedValue!)).toEqual(testData);
  });
  
  it('loads canvas history from storage', async () => {
    localStorage.setItem(`history_${testKey}`, JSON.stringify(testData));
    
    const loadedData = await loadCanvasHistory(testKey);
    expect(loadedData).toEqual(testData);
  });
  
  it('returns null when loading non-existent history', async () => {
    const loadedData = await loadCanvasHistory('non-existent-key');
    expect(loadedData).toBeNull();
  });
  
  it('clears canvas history from storage', async () => {
    localStorage.setItem(`history_${testKey}`, JSON.stringify(testData));
    
    await clearCanvasHistory(testKey);
    const storedValue = localStorage.getItem(`history_${testKey}`);
    expect(storedValue).toBeNull();
  });
  
  it('handles errors gracefully', async () => {
    // Mock a failure in localStorage
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = vi.fn(() => {
      throw new Error('Storage error');
    });
    
    try {
      await expect(saveCanvasHistory(testKey, testData)).rejects.toThrow();
    } finally {
      localStorage.setItem = originalSetItem;
    }
  });
});
