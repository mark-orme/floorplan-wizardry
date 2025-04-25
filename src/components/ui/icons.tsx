
import { 
  RotateCw, Globe, X, Eye, EyeOff, Lock, Unlock, Hand, 
  Eraser, ArrowUndo, ArrowRedo, ZoomIn, ZoomOut, Save, Download, 
  Text, RulerSquare, Layers, PlusCircle, Calculator, Hammer, 
  Home, Ruler, Type, Menu, Users, RefreshCcw, MousePointer, 
  Pencil, Square, Trash, ArrowDown, ArrowUp, Circle, LayoutGrid 
} from "lucide-react";

import { createIcon } from "lucide-react";

// Export icons as named exports
export {
  RotateCw, Globe, X, Eye, EyeOff, Lock, Unlock, Hand, 
  Eraser, ArrowUndo, ArrowRedo, ZoomIn, ZoomOut, Save, Download, 
  Text, RulerSquare, Layers, PlusCircle, Calculator, Hammer, 
  Home, Ruler, Type, Menu, Users, RefreshCcw, MousePointer, 
  Pencil, Square, Trash, ArrowDown, ArrowUp, Circle, LayoutGrid
};

// Aliases for legacy/compatibility, if needed:
export const Trash2 = Trash;

// Custom icons example (Move): ensure this covers legacy usage where not in Lucide.
export const MoveIcon = createIcon('Move', [
  ['polyline', { points: '5 9 2 12 5 15' }],
  ['polyline', { points: '9 5 12 2 15 5' }],
  ['polyline', { points: '15 19 12 22 9 19' }],
  ['polyline', { points: '19 9 22 12 19 15' }],
  ['line', { x1: '2', y1: '12', x2: '22', y2: '12' }],
  ['line', { x1: '12', y1: '2', x2: '12', y2: '22' }]
]);

// If you need more custom icons, define them above.
