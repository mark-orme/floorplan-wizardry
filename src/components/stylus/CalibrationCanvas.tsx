
import { fabric } from 'fabric';
import React, { useEffect, useRef } from 'react';

export const CalibrationCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 400,
      height: 300,
      backgroundColor: 'lightgray'
    });
    
    // Add a sample object to the canvas
    const circle = new fabric.Circle({ 
      radius: 20, 
      fill: 'red', 
      left: 100, 
      top: 100 
    });
    
    canvas.add(circle);

    return () => {
      canvas.dispose();
    };
  }, []);
  
  return (
    <canvas ref={canvasRef} width={400} height={300} style={{ border: '1px solid black' }} />
  );
};
