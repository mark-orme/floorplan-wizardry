
import { useState } from "react";
import { Canvas } from "@/components/Canvas";
import { CanvasLayout } from "@/components/CanvasLayout";
import { FloorPlanList } from "@/components/FloorPlanList";
import { DrawingToolbar } from "@/components/DrawingToolbar";
import { CanvasControllerProvider } from "@/components/canvas/controller/CanvasController";
import { DebugInfo } from "@/components/DebugInfo";

const Index = () => {
  const [showDebug, setShowDebug] = useState(false);

  return (
    <main className="flex min-h-screen flex-col w-full">
      <CanvasLayout
        sidebar={<FloorPlanList />}
        toolbar={<DrawingToolbar />}
        debug={showDebug && <DebugInfo />}
        debugToggle={() => setShowDebug(!showDebug)}
      >
        <CanvasControllerProvider>
          <Canvas />
        </CanvasControllerProvider>
      </CanvasLayout>
    </main>
  );
};

export default Index;
