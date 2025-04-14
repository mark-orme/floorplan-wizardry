
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Index from './pages/Index';
import FloorPlans from './pages/FloorPlans';
import { QueryProvider } from './providers/QueryProvider';
import { CanvasProvider, DrawingProvider } from './features/canvas';

function App() {
  return (
    <QueryProvider>
      <Router>
        <DrawingProvider>
          <CanvasProvider>
            <Toaster position="top-right" />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/floorplans" element={<FloorPlans />} />
            </Routes>
          </CanvasProvider>
        </DrawingProvider>
      </Router>
    </QueryProvider>
  );
}

export default App;
