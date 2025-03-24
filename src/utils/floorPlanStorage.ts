
import { FloorPlan, getDB, STORE_NAME } from './drawingTypes';

/** Load floor plans from IndexedDB (with fallback to localStorage for migration) */
export const loadFloorPlans = async (): Promise<FloorPlan[]> => {
  try {
    // Try IndexedDB first
    const db = await getDB();
    const result = await db.get(STORE_NAME, 'current');
    
    if (result?.data) {
      return result.data;
    }
    
    // Fallback to localStorage for existing user data migration
    const saved = localStorage.getItem('floorPlans');
    if (saved) {
      const parsedData = JSON.parse(saved);
      // Immediately save to IndexedDB for future use
      await saveFloorPlans(parsedData);
      return parsedData;
    }
  } catch (e) {
    console.error('Failed to load floor plans from IndexedDB:', e);
    
    // Final fallback to localStorage
    try {
      const saved = localStorage.getItem('floorPlans');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (localError) {
      console.error('Failed to load floor plans from localStorage:', localError);
    }
  }
  
  // Default floor plan if none exists
  return [{ strokes: [], label: 'Ground Floor', paperSize: 'infinite' }];
};

/** Save floor plans to IndexedDB (and localStorage as fallback) */
export const saveFloorPlans = async (floorPlans: FloorPlan[]): Promise<void> => {
  try {
    // Save to IndexedDB
    const db = await getDB();
    await db.put(STORE_NAME, { id: 'current', data: floorPlans });
    
    // Also save to localStorage as fallback/migration path
    localStorage.setItem('floorPlans', JSON.stringify(floorPlans));
  } catch (e) {
    console.error('Failed to save floor plans to IndexedDB:', e);
    
    // Fallback to just localStorage
    try {
      localStorage.setItem('floorPlans', JSON.stringify(floorPlans));
    } catch (localError) {
      console.error('Failed to save floor plans to localStorage:', localError);
    }
  }
};
