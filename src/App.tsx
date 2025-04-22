
import { Routes, Route } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { CanvasEngineProvider } from './contexts/CanvasEngineContext';
import PropertyDetail from './pages/PropertyDetail';
import Index from './pages/Index';
import { CanvasProvider } from './contexts/CanvasContext';
import FloorPlans from './pages/Floorplans';

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CanvasEngineProvider>
        <CanvasProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/properties/:id" element={<PropertyDetail />} />
            <Route path="/floorplans" element={<FloorPlans />} />
            <Route path="/floorplans/:id" element={<PropertyDetail />} />
          </Routes>
        </CanvasProvider>
      </CanvasEngineProvider>
    </QueryClientProvider>
  );
}

export default App;
