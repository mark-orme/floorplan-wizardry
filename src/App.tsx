
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Index from './pages/Index';
import FloorPlans from './pages/FloorPlans';
import { CanvasProvider } from './contexts/CanvasContext';
import { DrawingProvider } from './contexts/DrawingContext';

function App() {
  return (
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
  );
}

export default App;
