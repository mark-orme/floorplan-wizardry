import { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  ZoomIn,
  ZoomOut,
  Pencil,
  Square,
  Undo,
  Redo,
  Save,
  Trash,
} from "lucide-react";

export const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [tool, setTool] = useState<"draw" | "room">("draw");
  const [zoomLevel, setZoomLevel] = useState(1);

  // Scale factors: 1 meter = 100 pixels
  const PIXELS_PER_METER = 100;
  const SMALL_GRID = 0.1 * PIXELS_PER_METER; // 0.1m grid = 10px
  const LARGE_GRID = 1.0 * PIXELS_PER_METER; // 1.0m grid = 100px

  useEffect(() => {
    if (!canvasRef.current) return;

    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: "#FFFFFF", // Pure white background
      isDrawingMode: tool === "draw",
    });

    // Add small grid (0.1m)
    for (let i = 0; i < fabricCanvas.width!; i += SMALL_GRID) {
      fabricCanvas.add(
        new fabric.Line([i, 0, i, fabricCanvas.height!], {
          stroke: "#E6F3F8", // Very light blue for fine grid
          selectable: false,
          strokeWidth: 0.5,
          evented: false,
        })
      );
    }
    for (let i = 0; i < fabricCanvas.height!; i += SMALL_GRID) {
      fabricCanvas.add(
        new fabric.Line([0, i, fabricCanvas.width!, i], {
          stroke: "#E6F3F8", // Very light blue for fine grid
          selectable: false,
          strokeWidth: 0.5,
          evented: false,
        })
      );
    }

    // Add large grid (1.0m)
    for (let i = 0; i < fabricCanvas.width!; i += LARGE_GRID) {
      fabricCanvas.add(
        new fabric.Line([i, 0, i, fabricCanvas.height!], {
          stroke: "#C2E2F3", // Light blue for major grid
          selectable: false,
          strokeWidth: 1,
          evented: false,
        })
      );
    }
    for (let i = 0; i < fabricCanvas.height!; i += LARGE_GRID) {
      fabricCanvas.add(
        new fabric.Line([0, i, fabricCanvas.width!, i], {
          stroke: "#C2E2F3", // Light blue for major grid
          selectable: false,
          strokeWidth: 1,
          evented: false,
        })
      );
    }

    // Add 1m scale marker at bottom right
    const scaleMarker = new fabric.Group([
      new fabric.Line([fabricCanvas.width! - LARGE_GRID - 20, fabricCanvas.height! - 20, fabricCanvas.width! - 20, fabricCanvas.height! - 20], {
        stroke: "#C2E2F3",
        strokeWidth: 2,
      }),
      new fabric.Text("1m", {
        left: fabricCanvas.width! - LARGE_GRID/2 - 30,
        top: fabricCanvas.height! - 35,
        fontSize: 12,
        fill: "#88B7D3",
      })
    ], {
      selectable: false,
      evented: false,
    });
    fabricCanvas.add(scaleMarker);

    // Configure drawing brush
    if (fabricCanvas.freeDrawingBrush) {
      fabricCanvas.freeDrawingBrush.color = "#000000";
      fabricCanvas.freeDrawingBrush.width = 2;
    }

    setCanvas(fabricCanvas);
    toast.success("Canvas ready for drawing!");

    return () => {
      fabricCanvas.dispose();
    };
  }, []);

  useEffect(() => {
    if (!canvas) return;
    canvas.isDrawingMode = tool === "draw";
  }, [tool, canvas]);

  const handleZoom = (direction: "in" | "out") => {
    if (!canvas) return;
    const factor = direction === "in" ? 1.1 : 0.9;
    const newZoom = zoomLevel * factor;
    if (newZoom >= 0.5 && newZoom <= 3) {
      canvas.setZoom(newZoom);
      setZoomLevel(newZoom);
      toast(`Zoom: ${Math.round(newZoom * 100)}%`);
    }
  };

  const clearCanvas = () => {
    if (!canvas) return;
    // Clear only the drawings, not the grid
    const objects = canvas.getObjects('path');
    objects.forEach((obj) => canvas.remove(obj));
    canvas.renderAll();
    toast.success("Canvas cleared");
  };

  const saveCanvas = () => {
    if (!canvas) return;
    const dataUrl = canvas.toDataURL();
    const link = document.createElement("a");
    link.download = "floorplan.png";
    link.href = dataUrl;
    link.click();
    toast.success("Floorplan saved");
  };

  return (
    <div className="flex flex-col gap-6 p-6 max-w-[1200px] mx-auto">
      <Card className="p-6 backdrop-blur-sm bg-white/30 dark:bg-black/30 border border-gray-200 dark:border-gray-800">
        <div className="flex gap-4 mb-4">
          {/* Tool Selection */}
          <div className="flex gap-2">
            <Button
              variant={tool === "draw" ? "default" : "outline"}
              onClick={() => setTool("draw")}
              className="w-10 h-10 p-0 hover:scale-105 transition-transform"
              title="Draw Tool"
            >
              <Pencil className="w-4 h-4 transition-colors" />
            </Button>
            <Button
              variant={tool === "room" ? "default" : "outline"}
              onClick={() => setTool("room")}
              className="w-10 h-10 p-0 hover:scale-105 transition-transform"
              title="Room Tool"
            >
              <Square className="w-4 h-4 transition-colors" />
            </Button>
          </div>
          
          {/* History Controls */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="w-10 h-10 p-0 hover:scale-105 transition-transform hover:bg-gray-100 dark:hover:bg-gray-800"
              title="Undo"
            >
              <Undo className="w-4 h-4 transition-colors" />
            </Button>
            <Button
              variant="outline"
              className="w-10 h-10 p-0 hover:scale-105 transition-transform hover:bg-gray-100 dark:hover:bg-gray-800"
              title="Redo"
            >
              <Redo className="w-4 h-4 transition-colors" />
            </Button>
          </div>
          
          {/* Zoom Controls */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handleZoom("in")}
              className="w-10 h-10 p-0 hover:scale-105 transition-transform hover:bg-gray-100 dark:hover:bg-gray-800"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4 transition-colors" />
            </Button>
            <Button
              variant="outline"
              onClick={() => handleZoom("out")}
              className="w-10 h-10 p-0 hover:scale-105 transition-transform hover:bg-gray-100 dark:hover:bg-gray-800"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4 transition-colors" />
            </Button>
          </div>
          
          {/* Actions */}
          <div className="flex gap-2 ml-auto">
            <Button
              variant="outline"
              onClick={clearCanvas}
              className="w-10 h-10 p-0 hover:scale-105 transition-transform hover:bg-red-50 dark:hover:bg-red-950"
              title="Clear Canvas"
            >
              <Trash className="w-4 h-4 text-red-500 transition-colors" />
            </Button>
            <Button
              variant="default"
              onClick={saveCanvas}
              className="w-10 h-10 p-0 hover:scale-105 transition-transform"
              title="Save as PNG"
            >
              <Save className="w-4 h-4 transition-colors" />
            </Button>
          </div>
        </div>

        <canvas ref={canvasRef} />
      </Card>
    </div>
  );
};
