
/**
 * Floor plan type definition
 * @module types/FloorPlan
 */

export interface FloorPlan {
  /** Unique identifier */
  id: string;
  
  /** Floor plan name - matches UI usage */
  name: string;
  
  /** Display label */
  label: string;
  
  /** Floor plan data */
  data: any;
  
  /** User ID who owns this plan */
  userId: string;
  
  /** Wall objects */
  walls: any[];
  
  /** Room objects */
  rooms: any[];
  
  /** Stroke objects */
  strokes: any[];
  
  /** Canvas JSON representation */
  canvasJson: any;
  
  /** Canvas raw data */
  canvasData: any;
  
  /** Creation timestamp */
  createdAt: string;
  
  /** Last update timestamp */
  updatedAt: string;
  
  /** Gross internal area */
  gia: number;
  
  /** Floor level */
  level: number;
  
  /** Sort index */
  index: number;
  
  /** Metadata */
  metadata: {
    createdAt: string;
    updatedAt: string;
    paperSize: string;
    level: number;
    version: string;
    author: string;
    dateCreated: string;
    lastModified: string;
    notes: string;
  };
}
