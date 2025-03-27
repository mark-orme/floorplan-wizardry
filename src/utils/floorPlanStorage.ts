import { FloorPlan, PaperSize, stringToPaperSize } from "@/types/core/FloorPlan";

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
    
    const floorPlans = JSON.parse(storedData);
    
    // Process data for any missing or outdated properties
    return floorPlans.map((plan: any) => {
      // Ensure paperSize is properly typed
      if (plan.metadata && plan.metadata.paperSize) {
        plan.metadata.paperSize = stringToPaperSize(plan.metadata.paperSize);
      }
      
      return plan;
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
