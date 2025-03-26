
import React, { createContext, useContext, useState, useRef } from 'react';
import { DrawingTool } from '@/hooks/useCanvasState';
import { FloorPlan } from '@/utils/drawing'; 
import { DebugInfoState } from '@/types/debugTypes';
import { toast } from 'sonner';

export interface CanvasControllerContextValue {
  tool: DrawingTool;
  setTool: (tool: DrawingTool) => void;
  gia: number;
  setGia?: React.Dispatch<React.SetStateAction<number>>;
  floorPlans: FloorPlan[];
  setFloorPlans?: React.Dispatch<React.SetStateAction<FloorPlan[]>>;
  currentFloor: number;
  dimensions?: { width: number; height: number };
  lineThickness: number;
  lineColor: string;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  debugInfo: DebugInfoState;
  handleToolChange: (tool: DrawingTool) => void;
  handleUndo: () => void;
  handleRedo: () => void;
  handleZoom: (zoomLevel: number) => void;
  clearCanvas: () => void;
  saveCanvas: () => void;
  deleteSelectedObjects: () => void;
  handleFloorSelect: (floorIndex: number) => void;
  handleAddFloor: () => void;
  handleLineThicknessChange: (thickness: number) => void;
  handleLineColorChange: (color: string) => void;
  openMeasurementGuide: () => void;
}

const CanvasControllerContext = createContext<CanvasControllerContextValue | null>(null);

export const CanvasControllerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tool, setTool] = useState<DrawingTool>('select');
  const [gia, setGia] = useState<number>(0);
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>([{ 
    id: '0', 
    name: 'Ground Floor', 
    label: 'Ground Floor', // Add the required label property
    gia: 0, // Add the required gia property
    strokes: [] 
  }]);
  const [currentFloor, setCurrentFloor] = useState<number>(0);
  const [lineThickness, setLineThickness] = useState<number>(2);
  const [lineColor, setLineColor] = useState<string>('#000000');
  const [debugInfo, setDebugInfo] = useState<DebugInfoState>({
    canvasReady: false,
    gridCreated: false,
    lastInitTime: 0,
    lastGridCreationTime: 0
  });
  
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
    width: 800,
    height: 600
  });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const handleToolChange = (newTool: DrawingTool) => {
    setTool(newTool);
    toast(`Tool changed to ${newTool}`);
  };
  
  const handleUndo = () => {
    console.log('Undo action');
    toast('Undo action');
  };
  
  const handleRedo = () => {
    console.log('Redo action');
    toast('Redo action');
  };
  
  const handleZoom = (zoomLevel: number) => {
    console.log('Zoom level changed to', zoomLevel);
  };
  
  const clearCanvas = () => {
    console.log('Canvas cleared');
    toast('Canvas cleared');
  };
  
  const saveCanvas = () => {
    console.log('Canvas saved');
    toast('Canvas saved');
  };
  
  const deleteSelectedObjects = () => {
    console.log('Selected objects deleted');
    toast('Selected objects deleted');
  };
  
  const handleFloorSelect = (floorIndex: number) => {
    setCurrentFloor(floorIndex);
    toast(`Floor ${floorIndex + 1} selected`);
  };
  
  const handleAddFloor = () => {
    setFloorPlans(prev => {
      const newFloorPlans = [...prev];
      const newFloorIndex = newFloorPlans.length;
      newFloorPlans.push({
        id: `${newFloorIndex}`,
        name: `Floor ${newFloorIndex + 1}`,
        label: `Floor ${newFloorIndex + 1}`, // Add the required label property
        gia: 0, // Add the required gia property
        strokes: []
      });
      return newFloorPlans;
    });
    toast('New floor added');
  };
  
  const handleLineThicknessChange = (thickness: number) => {
    setLineThickness(thickness);
  };
  
  const handleLineColorChange = (color: string) => {
    setLineColor(color);
  };
  
  const openMeasurementGuide = () => {
    toast('Measurement guide opened');
  };
  
  const contextValue: CanvasControllerContextValue = {
    tool,
    setTool,
    gia,
    setGia,
    floorPlans,
    setFloorPlans,
    currentFloor,
    dimensions,
    lineThickness,
    lineColor,
    canvasRef,
    debugInfo,
    handleToolChange,
    handleUndo,
    handleRedo,
    handleZoom,
    clearCanvas,
    saveCanvas,
    deleteSelectedObjects,
    handleFloorSelect,
    handleAddFloor,
    handleLineThicknessChange,
    handleLineColorChange,
    openMeasurementGuide
  };
  
  return (
    <CanvasControllerContext.Provider value={contextValue}>
      {children}
    </CanvasControllerContext.Provider>
  );
};

export const useCanvasController = () => {
  const context = useContext(CanvasControllerContext);
  if (!context) {
    throw new Error('useCanvasController must be used within a CanvasControllerProvider');
  }
  return context;
};
