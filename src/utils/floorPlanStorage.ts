
import { FloorPlan, PaperSize } from '@/types/floorPlanTypes';
import { getDB, STORE_NAME } from './drawingTypes';

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
      // Validate paperSize values before returning
      const validData = parsedData.map((plan: any) => ({
        ...plan,
        paperSize: validatePaperSize(plan.paperSize),
        // Ensure required fields from both type systems
        id: plan.id || `floor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: plan.name || plan.label || 'Unnamed Floor',
        gia: plan.gia || 0
      }));
      // Immediately save to IndexedDB for future use
      await saveFloorPlans(validData);
      return validData;
    }
  } catch (e) {
    console.error('Failed to load floor plans from IndexedDB:', e);
    
    // Final fallback to localStorage
    try {
      const saved = localStorage.getItem('floorPlans');
      if (saved) {
        const parsedData = JSON.parse(saved);
        return parsedData.map((plan: any) => ({
          ...plan,
          paperSize: validatePaperSize(plan.paperSize),
          id: plan.id || `floor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: plan.name || plan.label || 'Unnamed Floor',
          gia: plan.gia || 0
        }));
      }
    } catch (localError) {
      console.error('Failed to load floor plans from localStorage:', localError);
    }
  }
  
  // Default floor plan if none exists
  return [{
    strokes: [], 
    label: 'Ground Floor', 
    paperSize: 'infinite',
    id: `floor-${Date.now()}`, 
    name: 'Ground Floor',
    gia: 0
  }];
};

/** Save floor plans to IndexedDB (and localStorage as fallback) */
export const saveFloorPlans = async (floorPlans: FloorPlan[]): Promise<void> => {
  try {
    // Ensure all paperSize values are valid
    const validatedFloorPlans = floorPlans.map(plan => ({
      ...plan,
      paperSize: validatePaperSize(plan.paperSize),
      // Ensure required fields from both type systems
      id: plan.id || `floor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: plan.name || plan.label || 'Unnamed Floor',
      gia: plan.gia || 0
    }));
    
    // Save to IndexedDB
    const db = await getDB();
    await db.put(STORE_NAME, { id: 'current', data: validatedFloorPlans });
    
    // Also save to localStorage as fallback/migration path
    localStorage.setItem('floorPlans', JSON.stringify(validatedFloorPlans));
  } catch (e) {
    console.error('Failed to save floor plans to IndexedDB:', e);
    
    // Fallback to just localStorage
    try {
      localStorage.setItem('floorPlans', JSON.stringify(floorPlans.map(plan => ({
        ...plan,
        paperSize: validatePaperSize(plan.paperSize),
        id: plan.id || `floor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: plan.name || plan.label || 'Unnamed Floor',
        gia: plan.gia || 0
      }))));
    } catch (localError) {
      console.error('Failed to save floor plans to localStorage:', localError);
    }
  }
};

/**
 * Validate and correct paperSize values to ensure they match the PaperSize type
 * @param {string | undefined} paperSize - The paper size to validate
 * @returns {PaperSize} A valid paper size
 */
function validatePaperSize(paperSize: string | undefined): PaperSize {
  if (paperSize === 'A4' || paperSize === 'A3' || paperSize === 'infinite') {
    return paperSize as PaperSize;
  }
  // Default to 'infinite' for invalid values
  return 'infinite';
}
