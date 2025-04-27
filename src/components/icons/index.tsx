
import React from 'react';
import {
  MousePointer2,
  PenLine,
  Eraser,
  Grid,
  Home,
  Pencil,
  Square,
  Hand,
  Eye,
  Send,
  PlusCircle,
  LogIn,
  ArrowRightLeft,
  Shield,
  Loader2,
  ShieldAlert,
  CheckCircle,
  XCircle,
  Key,
  RefreshCw,
  AlertTriangle,
  Clock,
  Settings,
  Sun,
  Moon,
  MoreHorizontal,
  Search,
  PanelLeft,
  Palette
} from 'lucide-react';

// Type for icon props
export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

// Icon mapping object
export const Icons = {
  mousePointer: MousePointer2,
  penLine: PenLine,
  eraser: Eraser,
  grid: Grid,
  home: Home,
  pencil: Pencil,
  square: Square,
  hand: Hand,
  eye: Eye,
  send: Send,
  plusCircle: PlusCircle,
  logIn: LogIn,
  arrowLeftRight: ArrowRightLeft,
  shield: Shield,
  loader: Loader2,
  shieldAlert: ShieldAlert,
  checkCircle: CheckCircle,
  xCircle: XCircle,
  key: Key,
  refresh: RefreshCw,
  alertTriangle: AlertTriangle,
  clock: Clock,
  settings: Settings,
  sun: Sun,
  moon: Moon,
  moreHorizontal: MoreHorizontal,
  search: Search,
  panelLeft: PanelLeft,
  palette: Palette,
  plus: PlusCircle
};

