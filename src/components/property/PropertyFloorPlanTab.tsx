
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Ruler } from 'lucide-react';
import { toast } from 'sonner';
import { UserRole } from '@/lib/supabase';
import { PropertyStatus } from '@/types/propertyTypes';
import { useCanvasErrorHandling } from '@/hooks/useCanvasErrorHandling';
import { FloorPlanCanvas } from './FloorPlanCanvas';
import { FloorPlanActions } from './FloorPlanActions';
import { MeasurementGuideModal } from '@/components/MeasurementGuideModal';
