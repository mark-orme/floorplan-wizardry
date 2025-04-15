
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import FloorPlans from '@/pages/FloorPlans';
import Index from '@/pages/Index';
import { PerformanceBadge } from '@/components/performance/PerformanceBadge';

function App() {
  return (
    <>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/floor-plans" element={<FloorPlans />} />
      </Routes>
      <PerformanceBadge />
    </>
  );
}

export default App;
