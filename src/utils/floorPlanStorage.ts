
import { FloorPlan, PaperSize, stringToPaperSize } from "@/types/core/FloorPlan";

interface StoredFloorPlan {
  metadata?: {
    paperSize?: string | PaperSize;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

/**
 * Load floor plans from storage
 * @returns Promise resolving to floor plans
 */
export const loadFloorPlans = async (): Promise<FloorPlan[]> => {
  try {
    const storedData = localStorage.getItem('floorPlans');
    if (!storedData) {
      return [];
    }
    
    const parsedData = JSON.parse(storedData) as StoredFloorPlan[];
    
    // Process data for any missing or outdated properties
    return parsedData.map((plan: StoredFloorPlan): FloorPlan => {
      // Ensure paperSize is properly typed
      if (plan.metadata?.paperSize) {
        const paperSizeString = String(plan.metadata.paperSize);
        plan.metadata.paperSize = stringToPaperSize(paperSizeString);
      }
      
      // Convert to FloorPlan with type safety
      return plan as FloorPlan;
    });
  } catch (error) {
    console.error('Error loading floor plans:', error);
    return [];
  }
};

/**
 * Save floor plans to storage
 * @param floorPlans Floor plans to save
 * @returns Promise resolving to void
 */
export const saveFloorPlans = async (floorPlans: FloorPlan[]): Promise<void> => {
  try {
    localStorage.setItem('floorPlans', JSON.stringify(floorPlans));
  } catch (error) {
    console.error('Error saving floor plans:', error);
  }
};

/**
 * Save last saved timestamp to local storage
 * @param date Date to save
 */
export const saveLastSavedTimestamp = (date: Date): void => {
  try {
    localStorage.setItem('floorPlansLastSaved', JSON.stringify(date.toISOString()));
  } catch (e) {
    console.error("Error saving last saved timestamp:", e);
  }
};
