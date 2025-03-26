
import { FloorPlan, PaperSize } from '@/types/floorPlanTypes';
import { getDB, STORE_NAME } from '@/types/databaseTypes';

/** 
 * Load floor plans from IndexedDB (with fallback to localStorage for migration)
 * @returns {Promise<FloorPlan[]>} Floor plans loaded from storage
 */
export const loadFloorPlans = async (): Promise<FloorPlan[]> => {
  try {
    // Try IndexedDB first
    const db = await getDB();
    const result = await db.get(STORE_NAME, 'current');
    
    if (result?.data) {
      return ensureRequiredFields(result.data);
    }
    
    // Fallback to localStorage for existing user data migration
    const saved = localStorage.getItem('floorPlans');
    if (saved) {
      const parsedData = JSON.parse(saved) as unknown[];
      // Validate and ensure all required fields are present
      const validData = ensureRequiredFields(parsedData);
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
        const parsedData = JSON.parse(saved) as unknown[];
        return ensureRequiredFields(parsedData);
      }
    } catch (localError) {
      console.error('Failed to load floor plans from localStorage:', localError);
    }
  }
  
  // Default floor plan if none exists
  return [{
    strokes: [], 
    label: 'Ground Floor', 
    paperSize: 'infinite' as PaperSize,
    id: `floor-${Date.now()}`, 
    name: 'Ground Floor',
    gia: 0
  }];
};

/** 
 * Save floor plans to IndexedDB (and localStorage as fallback)
 * @param {FloorPlan[]} floorPlans - Floor plans to save
 * @returns {Promise<boolean>} Success indicator
 */
export const saveFloorPlans = async (floorPlans: FloorPlan[]): Promise<boolean> => {
  try {
    // Ensure all required fields and valid paperSize values
    const validatedFloorPlans = ensureRequiredFields(floorPlans);
    
    // Save to IndexedDB
    const db = await getDB();
    await db.put(STORE_NAME, { id: 'current', data: validatedFloorPlans });
    
    // Also save to localStorage as fallback/migration path
    localStorage.setItem('floorPlans', JSON.stringify(validatedFloorPlans));
    return true;
  } catch (e) {
    console.error('Failed to save floor plans to IndexedDB:', e);
    
    // Fallback to just localStorage
    try {
      localStorage.setItem('floorPlans', JSON.stringify(ensureRequiredFields(floorPlans)));
      return true;
    } catch (localError) {
      console.error('Failed to save floor plans to localStorage:', localError);
      return false;
    }
  }
};

/**
 * Helper function to ensure all required fields are present in FloorPlan objects
 * @param {unknown[]} floorPlans - Array of floor plans to validate
 * @returns {FloorPlan[]} Validated floor plans with all required fields
 */
function ensureRequiredFields(floorPlans: unknown[]): FloorPlan[] {
  if (!Array.isArray(floorPlans)) {
    console.warn("Floor plans data is not an array, creating new empty array");
    return [];
  }
  
  return floorPlans.map((plan: any) => ({
    ...plan,
    paperSize: validatePaperSize(plan.paperSize),
    // Ensure required fields from both type systems
    id: plan.id || `floor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: plan.name || plan.label || 'Unnamed Floor',
    gia: typeof plan.gia === 'number' ? plan.gia : 0,
    label: plan.label || plan.name || 'Unnamed Floor',
    strokes: Array.isArray(plan.strokes) ? plan.strokes : []
  }));
}

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
