
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryProvider } from './providers/QueryProvider';
import { CanvasEngineProvider } from './contexts/CanvasEngineContext';
import PropertyDetail from './pages/PropertyDetail';
import Index from './pages/Index';

export function App() {
  return (
    <QueryProvider>
      <CanvasEngineProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/properties/:id" element={<PropertyDetail />} />
            <Route path="/floorplans" element={<Index />} />
            <Route path="/floorplans/:id" element={<PropertyDetail />} />
          </Routes>
        </Router>
      </CanvasEngineProvider>
    </QueryProvider>
  );
}

export default App;
