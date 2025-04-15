
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { 
  saveCanvasHistory, 
  loadCanvasHistory, 
  clearCanvasHistory, 
  getHistoryKeys, 
  migrateHistoryData 
} from '@/utils/storage/historyStorage';

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
    }),
    getAllKeys: vi.fn(async (store) => {
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(`${store}_`)) {
          keys.push(key.replace(`${store}_`, ''));
        }
      }
      return keys;
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
  
  it('trims history to maximum size', async () => {
    const largeData = Array.from({ length: 100 }, (_, i) => `state${i}`);
    const maxStates = 50;
    
    await saveCanvasHistory(testKey, largeData, maxStates);
    const storedValue = localStorage.getItem(`history_${testKey}`);
    const parsedData = JSON.parse(storedValue!);
    
    expect(parsedData.length).toBe(maxStates);
    expect(parsedData[0]).toBe(`state${largeData.length - maxStates}`);
    expect(parsedData[maxStates - 1]).toBe(`state${largeData.length - 1}`);
  });
  
  it('gets all history keys', async () => {
    localStorage.setItem(`history_${testKey}1`, JSON.stringify(testData));
    localStorage.setItem(`history_${testKey}2`, JSON.stringify(testData));
    localStorage.setItem(`other_key`, JSON.stringify(testData)); // Should be ignored
    
    const keys = await getHistoryKeys();
    expect(keys.length).toBe(2);
    expect(keys).toContain(`${testKey}1`);
    expect(keys).toContain(`${testKey}2`);
  });
  
  it('migrates history data', async () => {
    // Setup test data
    localStorage.setItem(`history_${testKey}1`, JSON.stringify(testData));
    localStorage.setItem(`history_${testKey}2`, JSON.stringify(testData));
    
    // Define migration function that adds a prefix to each state
    const migrationFn = (oldData: string[]) => oldData.map(state => `migrated_${state}`);
    
    // Run migration
    await migrateHistoryData(migrationFn);
    
    // Check results
    const migratedData1 = JSON.parse(localStorage.getItem(`history_${testKey}1`)!);
    const migratedData2 = JSON.parse(localStorage.getItem(`history_${testKey}2`)!);
    
    expect(migratedData1[0]).toBe('migrated_state1');
    expect(migratedData2[2]).toBe('migrated_state3');
  });
});
