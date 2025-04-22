
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CanvasEngineProvider } from './contexts/CanvasEngineContext';
import PropertyDetail from './pages/PropertyDetail';
import Index from './pages/Index';
import { CanvasProvider } from './contexts/CanvasContext';

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
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/properties/:id" element={<PropertyDetail />} />
              <Route path="/floorplans" element={<Index />} />
              <Route path="/floorplans/:id" element={<PropertyDetail />} />
            </Routes>
          </Router>
        </CanvasProvider>
      </CanvasEngineProvider>
    </QueryClientProvider>
  );
}

export default App;
