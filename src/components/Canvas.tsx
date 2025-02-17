
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

  useEffect(() => {
    if (!canvasRef.current) return;

    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: "#F8F9FA",
    });

    // Add grid
    const gridSize = 20;
    for (let i = 0; i < fabricCanvas.width!; i += gridSize) {
      fabricCanvas.add(
        new fabric.Line([i, 0, i, fabricCanvas.height!], {
          stroke: "#DEE2E6",
          selectable: false,
        })
      );
    }
    for (let i = 0; i < fabricCanvas.height!; i += gridSize) {
      fabricCanvas.add(
        new fabric.Line([0, i, fabricCanvas.width!, i], {
          stroke: "#DEE2E6",
          selectable: false,
        })
      );
    }

    setCanvas(fabricCanvas);
    toast.success("Canvas ready for drawing!");

    return () => {
      fabricCanvas.dispose();
    };
  }, []);

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
    canvas.clear();
    canvas.backgroundColor = "#F8F9FA";
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
              className="w-10 h-10 p-0"
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              variant={tool === "room" ? "default" : "outline"}
              onClick={() => setTool("room")}
              className="w-10 h-10 p-0"
            >
              <Square className="w-4 h-4" />
            </Button>
          </div>
          
          {/* History Controls */}
          <div className="flex gap-2">
            <Button variant="outline" className="w-10 h-10 p-0">
              <Undo className="w-4 h-4" />
            </Button>
            <Button variant="outline" className="w-10 h-10 p-0">
              <Redo className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Zoom Controls */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handleZoom("in")}
              className="w-10 h-10 p-0"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              onClick={() => handleZoom("out")}
              className="w-10 h-10 p-0"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Actions */}
          <div className="flex gap-2 ml-auto">
            <Button
              variant="outline"
              onClick={clearCanvas}
              className="w-10 h-10 p-0"
            >
              <Trash className="w-4 h-4" />
            </Button>
            <Button
              variant="default"
              onClick={saveCanvas}
              className="w-10 h-10 p-0"
            >
              <Save className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden bg-white">
          <canvas ref={canvasRef} />
        </div>
      </Card>
    </div>
  );
};
