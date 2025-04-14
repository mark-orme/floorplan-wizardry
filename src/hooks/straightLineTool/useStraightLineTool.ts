// First, declare the function references before they're used
const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
  if (!fabricCanvasRef.current || !isActive) return;
  
  // Store starting point
  const pointer = fabricCanvasRef.current.getPointer(e);
  startPointRef.current = { x: pointer.x, y: pointer.y };
  
  // Create temporary line
  const line = new fabric.Line(
    [pointer.x, pointer.y, pointer.x, pointer.y],
    {
      strokeWidth: lineThickness,
      stroke: lineColor,
      selectable: false,
      evented: false,
      strokeLineCap: 'round',
      strokeLineJoin: 'round'
    }
  );
  
  // Add to canvas
  fabricCanvasRef.current.add(line);
  tempLineRef.current = line;
  
  // Set drawing state
  isDrawingRef.current = true;
  
  // Disable regular drawing mode while using straight line tool
  if (fabricCanvasRef.current.isDrawingMode) {
    previousDrawingModeRef.current = true;
    fabricCanvasRef.current.isDrawingMode = false;
  }
};

const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
  if (!fabricCanvasRef.current || !isDrawingRef.current || !tempLineRef.current || !startPointRef.current) return;
  
  // Get current pointer position
  const pointer = fabricCanvasRef.current.getPointer(e);
  
  // Update line end point
  tempLineRef.current.set({
    x2: pointer.x,
    y2: pointer.y
  });
  
  // Apply angle snapping if enabled
  if (snapToAngle) {
    const startPoint = startPointRef.current;
    const angle = Math.atan2(pointer.y - startPoint.y, pointer.x - startPoint.x) * (180 / Math.PI);
    const snappedAngle = Math.round(angle / snapAngleDeg) * snapAngleDeg;
    const distance = Math.sqrt(
      Math.pow(pointer.x - startPoint.x, 2) + 
      Math.pow(pointer.y - startPoint.y, 2)
    );
    
    // Calculate new endpoint based on snapped angle
    const radians = snappedAngle * (Math.PI / 180);
    tempLineRef.current.set({
      x2: startPoint.x + distance * Math.cos(radians),
      y2: startPoint.y + distance * Math.sin(radians)
    });
  }
  
  fabricCanvasRef.current.renderAll();
};

const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
  if (!fabricCanvasRef.current || !isDrawingRef.current || !tempLineRef.current) return;
  
  // Finalize the line
  tempLineRef.current.set({
    selectable: true,
    evented: true
  });
  
  // Add metadata for identification
  tempLineRef.current.set('objectType', 'straightLine');
  
  // Restore previous drawing mode
  if (previousDrawingModeRef.current) {
    fabricCanvasRef.current.isDrawingMode = true;
    previousDrawingModeRef.current = false;
  }
  
  // Reset state
  isDrawingRef.current = false;
  tempLineRef.current = null;
  startPointRef.current = null;
  
  // Trigger canvas update
  fabricCanvasRef.current.renderAll();
  
  // Optionally trigger change event
  if (onChange) {
    onChange(fabricCanvasRef.current);
  }
};

// Now these can be used in the useEffect or wherever they were being used
useEffect(() => {
  if (!canvasRef.current) return;
  
  // Add event listeners
  if (isActive) {
    canvasRef.current.addEventListener('pointerdown', handlePointerDown);
    canvasRef.current.addEventListener('pointermove', handlePointerMove);
    canvasRef.current.addEventListener('pointerup', handlePointerUp);
    
    // Change cursor to indicate drawing mode
    canvasRef.current.style.cursor = 'crosshair';
  } else {
    // Reset cursor when tool is inactive
    if (canvasRef.current.style.cursor === 'crosshair') {
      canvasRef.current.style.cursor = 'default';
    }
  }
  
  // Cleanup function
  return () => {
    if (canvasRef.current) {
      canvasRef.current.removeEventListener('pointerdown', handlePointerDown);
      canvasRef.current.removeEventListener('pointermove', handlePointerMove);
      canvasRef.current.removeEventListener('pointerup', handlePointerUp);
      
      // Reset cursor
      canvasRef.current.style.cursor = 'default';
    }
  };
}, [isActive, lineColor, lineThickness, snapToAngle, snapAngleDeg]);
