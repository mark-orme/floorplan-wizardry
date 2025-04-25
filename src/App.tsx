import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/query-client';
import { CanvasEngineProvider } from './contexts/CanvasEngineContext';
import PropertyDetail from './pages/PropertyDetail';
import Index from './pages/Index';
import { CanvasProvider } from './contexts/CanvasContext';
import FloorPlans from './pages/Floorplans';

// Create router
const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/properties/:id",
    element: <PropertyDetail />,
  },
  {
    path: "/floorplans",
    element: <FloorPlans />,
  },
  {
    path: "/floorplans/:id",
    element: <PropertyDetail />,
  }
]);

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CanvasEngineProvider>
        <CanvasProvider>
          <RouterProvider router={router} />
        </CanvasProvider>
      </CanvasEngineProvider>
    </QueryClientProvider>
  );
}

export default App;
