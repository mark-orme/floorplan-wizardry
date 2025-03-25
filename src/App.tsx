
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import PropertyForm from "./components/PropertyForm";
import RoleGuard from "./components/RoleGuard";
import { UserRole } from "./lib/supabase";
import { ErrorBoundary } from "react-error-boundary";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
    },
  },
});

// Simple fallback component for error boundaries
const ErrorFallback = () => (
  <div className="flex flex-col items-center justify-center h-screen">
    <h2 className="text-xl font-semibold mb-4">Something went wrong</h2>
    <p className="mb-4">We're having some trouble loading this page.</p>
    <button 
      onClick={() => window.location.href = '/properties'}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Go to Properties
    </button>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Routes>
              {/* Default route redirects to properties */}
              <Route path="/" element={<Navigate to="/properties" replace />} />
              
              {/* Auth route - accessible to all */}
              <Route path="/auth" element={<Auth />} />
              
              {/* Properties routes */}
              <Route 
                path="/properties" 
                element={
                  <ErrorBoundary FallbackComponent={ErrorFallback}>
                    <RoleGuard 
                      allowedRoles={[UserRole.PHOTOGRAPHER, UserRole.PROCESSING_MANAGER, UserRole.MANAGER]}
                      fallbackElement={<Properties />} // Show properties to all, but with limited functionality
                    >
                      <Properties />
                    </RoleGuard>
                  </ErrorBoundary>
                } 
              />
              <Route 
                path="/properties/new" 
                element={
                  <ErrorBoundary FallbackComponent={ErrorFallback}>
                    <RoleGuard 
                      allowedRoles={[UserRole.PHOTOGRAPHER, UserRole.MANAGER]}
                      redirectTo="/properties"
                    >
                      <PropertyForm />
                    </RoleGuard>
                  </ErrorBoundary>
                } 
              />
              <Route 
                path="/properties/:id" 
                element={
                  <ErrorBoundary FallbackComponent={ErrorFallback}>
                    <RoleGuard 
                      allowedRoles={[UserRole.PHOTOGRAPHER, UserRole.PROCESSING_MANAGER, UserRole.MANAGER]}
                      redirectTo="/properties"
                    >
                      <PropertyDetail />
                    </RoleGuard>
                  </ErrorBoundary>
                } 
              />
              
              {/* Floor plan editor - accessible to all authenticated users */}
              <Route 
                path="/floorplans" 
                element={
                  <ErrorBoundary FallbackComponent={ErrorFallback}>
                    <Index />
                  </ErrorBoundary>
                } 
              />
              
              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ErrorBoundary>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
