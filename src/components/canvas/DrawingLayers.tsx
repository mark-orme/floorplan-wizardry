import React from "react";
import { Canvas as FabricCanvas } from "fabric";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Layers, PlusCircle } from "@/components/ui/icons";

interface DrawingLayersProps {
  layerCount: number;
  activeLayerName: string;
  onAddLayer: () => void;
  onShowLayerPanel: () => void;
}

export const DrawingLayers: React.FC<DrawingLayersProps> = ({
  layerCount,
  activeLayerName,
  onAddLayer,
  onShowLayerPanel
}) => {
  return (
    <div className="absolute bottom-4 left-4 z-10 flex flex-col gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        className="bg-white/80 backdrop-blur-sm shadow-sm flex items-center gap-2"
        onClick={onShowLayerPanel}
      >
        <Layers className="h-4 w-4" />
        <span className="hidden sm:inline">Layers</span>
        <Badge variant="secondary" className="ml-1 h-5 px-1">
          {layerCount}
        </Badge>
      </Button>
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 bg-white/80 backdrop-blur-sm shadow-sm"
          onClick={onAddLayer}
          title="Add new layer"
        >
          <PlusCircle className="h-4 w-4" />
        </Button>
        
        <Badge variant="outline" className="bg-white/80 backdrop-blur-sm shadow-sm">
          {activeLayerName}
        </Badge>
      </div>
    </div>
  );
};
