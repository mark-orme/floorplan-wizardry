
/**
 * FloorPlan data structure
 */
export interface FloorPlan {
  id: string;
  /** matches the UI's use */
  name: string;
  // Additional properties as needed
  data?: any;
  created?: Date;
  modified?: Date;
  isActive?: boolean;
}
