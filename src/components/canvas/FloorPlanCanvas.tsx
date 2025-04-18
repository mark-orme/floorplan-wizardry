import React, { useCallback, useState, useEffect, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { ConnectedDrawingCanvas } from './ConnectedDrawingCanvas';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileDrawingToolbar } from './MobileDrawingToolbar';
import { DrawingMode } from '@/constants/drawingModes';
import { TouchGestureHandler } from './TouchGestureHandler';
import '@/styles/mobile-canvas.css';

interface FloorPlanCanvasProps {
  onCanvasReady?: (canvas: any) => void;
}

export const FloorPlanCanvas: React.FC<FloorPlanCanvasProps> = ({ onCanvasReady }) => {
  const isMobile = useIsMobile();
  const [activeTool, setActiveTool] = useState<DrawingMode>(DrawingMode.SELECT);
  const [lineColor, setLineColor] = useState<string>("#000000");
  const [lineThickness, setLineThickness] = useState<number>(2);
  const [canUndo, setCanUndo] = useState<boolean>(false);
  const [canRedo, setCanRedo] = useState<boolean>(false);
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [canvasInitialized, setCanvasInitialized] = useState<boolean>(false);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  
  const width = 800;
  const height = 600;
  
  const containerStyle = {
    width: '100%',
    maxWidth: width,
    height: 'auto',
    aspectRatio: `${width}/${height}`,
    overflow: 'hidden',
    position: 'relative' as const
  };
  
  useEffect(() => {
    if (!canvas) return;
    
    const resizeCanvas = () => {
      if (canvasContainerRef.current) {
        const containerWidth = canvasContainerRef.current.clientWidth;
        const scale = containerWidth / width;
        
        if (canvas.wrapperEl) {
          canvas.wrapperEl.style.transform = `scale(${scale})`;
          canvas.wrapperEl.style.transformOrigin = 'top left';
          canvas.wrapperEl.style.width = `${width}px`;
          canvas.wrapperEl.style.height = `${height}px`;
          
          if (isMobile) {
            const gridObjects = canvas.getObjects().filter(obj => 
              (obj as any).isGrid === true || (obj as any).objectType === 'grid'
            );
            
            if (gridObjects.length > 0) {
              console.log(`Found ${gridObjects.length} grid objects, ensuring visibility on mobile`);
              gridObjects.forEach(obj => {
                obj.set({
                  visible: true,
                  opacity: 1,
                  stroke: 'rgba(180, 180, 180, 0.8)'
                });
              });
              canvas.renderAll();
            } else {
              console.warn('No grid objects found on resize');
            }
          }
        }
      }
    };
    
    if (isMobile && canvas.wrapperEl) {
      canvas.wrapperEl.classList.add('mobile-canvas-wrapper');
      console.log('Added mobile-canvas-wrapper class');
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const initTimeout = setTimeout(() => {
      setCanvasInitialized(true);
      console.log('Canvas fully initialized, touchable elements ready');
    }, 300);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      clearTimeout(initTimeout);
      if (canvas && canvas.wrapperEl) {
        canvas.wrapperEl.classList.remove('mobile-canvas-wrapper');
      }
    };
  }, [canvas, isMobile, width, height]);
  
  const handleCanvasRef = useCallback((canvas: FabricCanvas) => {
    if (!canvas) return;
    
    canvas.isDrawingMode = activeTool === DrawingMode.DRAW;
    
    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = lineColor;
      canvas.freeDrawingBrush.width = lineThickness;
    }
    
    console.log('Canvas received in FloorPlanCanvas component', canvas);
    setCanvas(canvas);
    
    if (onCanvasReady) {
      const updateUndoRedoState = () => {
        setCanUndo(true);
        setCanRedo(false);
      };
      
      canvas.on('object:added', updateUndoRedoState);
      canvas.on('object:modified', updateUndoRedoState);
      canvas.on('object:removed', updateUndoRedoState);
      
      const canvasOperations = {
        canvas,
        undo: () => {
          console.log("Undo operation");
        },
        redo: () => {
          console.log("Redo operation");
        },
        clearCanvas: () => {
          const objects = canvas.getObjects();
          objects.forEach(obj => {
            if (!(obj as any).isGrid) {
              canvas.remove(obj);
            }
          });
          canvas.renderAll();
        },
        saveCanvas: () => {
          console.log("Save operation");
        },
        canUndo: true,
        canRedo: false
      };
      
      onCanvasReady(canvasOperations);
      
      setTimeout(() => {
        const gridObjects = canvas.getObjects().filter(obj => 
          (obj as any).isGrid === true || (obj as any).objectType === 'grid'
        );
        
        console.log(`Grid check: found ${gridObjects.length} grid objects after canvas ready`);
        
        if (gridObjects.length === 0 && isMobile) {
          console.warn('No grid found on mobile, attempting to recreate');
          try {
            import('@/utils/gridCreator').then(({ createGrid }) => {
              const gridSize = 30;
              const newGridObjects = createGrid(canvas, width, height, gridSize);
              console.log(`Emergency grid creation added ${newGridObjects.length} objects`);
              canvas.renderAll();
            });
          } catch (error) {
            console.error('Failed to create emergency grid:', error);
          }
        }
      }, 500);
    }
  }, [onCanvasReady, activeTool, lineColor, lineThickness, isMobile, width, height]);
  
  const handleToolChange = (tool: DrawingMode) => {
    setActiveTool(tool);
    if (canvas) {
      canvas.isDrawingMode = tool === DrawingMode.DRAW;
      
      if (tool === DrawingMode.SELECT) {
        canvas.selection = true;
      }
      
      if (tool === DrawingMode.DRAW && canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.color = lineColor;
        canvas.freeDrawingBrush.width = lineThickness;
      }
      
      canvas.renderAll();
    }
  };
  
  const handleLineColorChange = (color: string) => {
    setLineColor(color);
    if (canvas && canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = color;
    }
  };
  
  const handleLineThicknessChange = (thickness: number) => {
    setLineThickness(thickness);
    if (canvas && canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.width = thickness;
    }
  };
  
  const handleUndo = () => {
    console.log("Undo triggered");
  };
  
  const handleRedo = () => {
    console.log("Redo triggered");
  };
  
  const handleClear = () => {
    if (canvas) {
      const objects = canvas.getObjects();
      objects.forEach(obj => {
        if (!(obj as any).isGrid) {
          canvas.remove(obj);
        }
      });
      canvas.renderAll();
    }
  };
  
  const handleSave = () => {
    console.log("Save triggered");
  };
  
  const handleZoomIn = () => {
    if (canvas) {
      const newZoom = zoom * 1.1;
      setZoom(newZoom);
      canvas.setZoom(newZoom);
      canvas.renderAll();
    }
  };
  
  const handleZoomOut = () => {
    if (canvas) {
      const newZoom = zoom / 1.1;
      setZoom(newZoom);
      canvas.setZoom(newZoom);
      canvas.renderAll();
    }
  };
  
  return (
    <div className="flex flex-col items-center w-full min-h-0">
      <div 
        ref={canvasContainerRef} 
        style={containerStyle} 
        className={`relative border border-border rounded-md bg-white shadow-sm ${isMobile ? 'mobile-container' : ''}`}
        data-is-mobile={isMobile ? 'true' : 'false'}
      >
        <ConnectedDrawingCanvas
          width={width}
          height={height}
          showGrid={true}
          onCanvasReady={handleCanvasRef}
        />
        
        {canvas && canvasInitialized && isMobile && (
          <TouchGestureHandler 
            canvas={canvas} 
            lineThickness={lineThickness}
            tool={activeTool}
          />
        )}
        
        {isMobile && (
          <MobileDrawingToolbar 
            activeTool={activeTool}
            onToolChange={setActiveTool}
            lineColor={lineColor}
            lineThickness={lineThickness}
            onLineColorChange={setLineColor}
            onLineThicknessChange={setLineThickness}
            onUndo={() => console.log("Undo triggered")}
            onRedo={() => console.log("Redo triggered")}
            onClear={() => {
              if (canvas) {
                const objects = canvas.getObjects();
                objects.forEach(obj => {
                  if (!(obj as any).isGrid) {
                    canvas.remove(obj);
                  }
                });
                canvas.renderAll();
              }
            }}
            onSave={() => console.log("Save triggered")}
            onZoomIn={() => {
              if (canvas) {
                const newZoom = zoom * 1.1;
                setZoom(newZoom);
                canvas.setZoom(newZoom);
                canvas.renderAll();
              }
            }}
            onZoomOut={() => {
              if (canvas) {
                const newZoom = zoom / 1.1;
                setZoom(newZoom);
                canvas.setZoom(newZoom);
                canvas.renderAll();
              }
            }}
            canUndo={canUndo}
            canRedo={canRedo}
          />
        )}
      </div>
    </div>
  );
};

export default FloorPlanCanvas;
