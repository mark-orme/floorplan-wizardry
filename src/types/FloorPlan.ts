
export interface FloorPlan {
  id: string;
  name: string;
  label: string;
  data: any; // Generic data container 
  userId: string;
  walls: any[];
  rooms: any[];
  strokes: any[];
  canvasJson: string | null;
  canvasData: any | null;
  createdAt: string;
  updatedAt: string;
  gia: number;
  level: number;
  index: number;
  metadata: {
    createdAt: string;
    updatedAt: string;
    paperSize: PaperSize;
    level: number;
  };
}

export enum PaperSize {
  A4 = 'A4',
  A3 = 'A3',
  A2 = 'A2', 
  A1 = 'A1',
  A0 = 'A0'
}

export const stringToPaperSize = (size: string): PaperSize => {
  switch (size.toUpperCase()) {
    case 'A4': return PaperSize.A4;
    case 'A3': return PaperSize.A3;
    case 'A2': return PaperSize.A2; 
    case 'A1': return PaperSize.A1;
    case 'A0': return PaperSize.A0;
    default: return PaperSize.A4;
  }
};
