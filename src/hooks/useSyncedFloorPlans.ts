
import { useState, useCallback, useEffect } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { v4 as uuidv4 } from 'uuid';
import { FloorPlan } from '@/types/floorPlanTypes';
import { useFloorPlanDrawing } from './floor-plan/useFloorPlanDrawing';
import { DrawingMode } from '@/constants/drawingModes';

export interface UseSyncedFloorPlansProps {
  initialFloorPlans?: FloorPlan[];
  defaultFloorIndex?: number;
  fabricCanvasRef?: React.MutableRefObject<FabricCanvas | null>;
  syncInterval?: number;
  autoSync?: boolean;
}

export interface UseSyncedFloorPlansResult {
  floorPlans: FloorPlan[];
  currentFloorIndex: number;
  setCurrentFloorIndex: React.Dispatch<React.SetStateAction<number>>;
  currentFloorPlan: FloorPlan | null;
  addFloorPlan: () => void;
  removeFloorPlan: (index: number) => void;
  drawFloorPlan: (canvas: FabricCanvas, floorPlan: FloorPlan) => void;
  isDrawing: boolean;
  isSyncing: boolean;
  lastSynced: Date | null;
}

export const useSyncedFloorPlans = ({
  initialFloorPlans = [],
  defaultFloorIndex = 0,
  fabricCanvasRef,
  syncInterval = 30000, // Default to 30 seconds
  autoSync = true
}: UseSyncedFloorPlansProps): UseSyncedFloorPlansResult => {
  // State for floor plans
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>(initialFloorPlans.map(plan => ({
    ...plan,
    data: plan.data || {},
    userId: plan.userId || 'default-user'
  })));
  const [currentFloorIndex, setCurrentFloorIndex] = useState(defaultFloorIndex);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  
  // Get current floor plan
  const currentFloorPlan = floorPlans[currentFloorIndex] || null;
  
  // Initialize floor plan drawing hook
  const {
    isDrawing,
    drawingPoints,
    currentPoint,
    startDrawing,
    continueDrawing,
    endDrawing,
    cancelDrawing,
    addStroke,
    calculateAreas,
    drawFloorPlan
  } = useFloorPlanDrawing({
    fabricCanvasRef: fabricCanvasRef || { current: null },
    tool: DrawingMode.SELECT,
    floorPlan: currentFloorPlan as FloorPlan,
    setFloorPlan: (floorPlan) => {
      if (typeof floorPlan === 'function') {
        setFloorPlans(prev => {
          const updated = [...prev];
          updated[currentFloorIndex] = floorPlan(prev[currentFloorIndex]);
          return updated;
        });
      } else {
        setFloorPlans(prev => {
          const updated = [...prev];
          updated[currentFloorIndex] = floorPlan;
          return updated;
        });
      }
    }
  });
  
  // Add a new floor plan
  const addFloorPlan = useCallback(() => {
    const newFloorPlan: FloorPlan = {
      id: uuidv4(),
      name: `Floor ${floorPlans.length + 1}`,
      label: `Floor ${floorPlans.length + 1}`,
      index: floorPlans.length,
      level: floorPlans.length,
      walls: [],
      rooms: [],
      strokes: [],
      gia: 0,
      canvasData: null,
      canvasJson: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        paperSize: 'A4',
        level: floorPlans.length
      },
      data: {},
      userId: 'default-user'
    };
    
    setFloorPlans(prev => [...prev, newFloorPlan]);
    setCurrentFloorIndex(floorPlans.length);
  }, [floorPlans.length]);
  
  // Remove a floor plan
  const removeFloorPlan = useCallback((index: number) => {
    if (floorPlans.length <= 1) {
      console.warn('Cannot remove the last floor plan');
      return;
    }
    
    setFloorPlans(prev => prev.filter((_, i) => i !== index));
    
    if (currentFloorIndex >= index) {
      setCurrentFloorIndex(prev => Math.max(0, prev - 1));
    }
  }, [floorPlans.length, currentFloorIndex]);
  
  // Auto-sync functionality
  useEffect(() => {
    if (!autoSync) return;
    
    const syncTimer = setInterval(() => {
      // Mock sync implementation
      console.log('Auto-syncing floor plans');
      setIsSyncing(true);
      
      // Simulate network request
      setTimeout(() => {
        setIsSyncing(false);
        setLastSynced(new Date());
        console.log('Sync complete');
      }, 1000);
    }, syncInterval);
    
    return () => {
      clearInterval(syncTimer);
    };
  }, [autoSync, syncInterval]);
  
  return {
    floorPlans,
    currentFloorIndex,
    setCurrentFloorIndex,
    currentFloorPlan,
    addFloorPlan,
    removeFloorPlan,
    drawFloorPlan,
    isDrawing,
    isSyncing,
    lastSynced
  };
};
