
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
import { ErrorFallback } from "./components/ErrorFallback";
import * as Sentry from "@sentry/react";

// Configure query client with Sentry integration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
      // Updated to use meta.onError which is the correct approach for TanStack Query v4+
      meta: {
        onError: (error: unknown) => {
          Sentry.captureException(error, {
            tags: {
              source: 'react-query'
            }
          });
        }
      }
    },
  },
});

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
              
              {/* Properties routes - Simplified to ensure proper loading */}
              <Route path="/properties" element={<Properties />} />
              <Route path="/properties/new" element={<PropertyForm />} />
              <Route path="/properties/:id" element={<PropertyDetail />} />
              
              {/* Floor plan editor - accessible to all */}
              <Route path="/floorplans" element={<Index />} />
              
              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ErrorBoundary>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default Sentry.withProfiler(App);
