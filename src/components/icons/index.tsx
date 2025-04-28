
import React from 'react';
import {
  AiOutlineSelect as MousePointer,
  AiOutlineEdit as Pencil,
  AiOutlineLine as PenLine,
  AiOutlineDelete as Eraser,
  AiOutlineAppstore as Grid,
  AiOutlineHome as Home,
  AiOutlineContainer as Square,
  AiOutlineSave as Hand,
  AiOutlineBgColors as Palette,
  AiOutlinePlus as Plus,
  AiOutlineMinus as Minus,
  AiOutlineEye as Eye,
  AiOutlineSend as Send,
  AiOutlinePlusCircle,
  AiOutlineLogin as LogIn,
  AiOutlineSwapRight as ArrowRightLeft,
  AiOutlineSafety as Shield,
  AiOutlineLoading as Loader,
  AiOutlineWarning as ShieldAlert,
  AiOutlineCheckCircle,
  AiOutlineCloseCircle as XCircle,
  AiOutlineKey,
  AiOutlineReload as RefreshCw,
  AiOutlineClockCircle as Clock,
  AiOutlineSetting as Settings,
  AiOutlineSun as Sun,
  AiOutlineMoon as Moon,
  AiOutlineSearch as Search,
  AiOutlineMenu as GripVertical,
  AiOutlineMenuFold as PanelLeft,
  AiOutlineEllipsis as MoreHorizontal,
} from 'react-icons/ai';

export const Icons = {
  mousePointer: MousePointer,
  pencil: Pencil,
  penLine: PenLine,
  eraser: Eraser,
  grid: Grid,
  home: Home,
  square: Square,
  hand: Hand,
  palette: Palette,
  plus: Plus,
  minus: Minus,
  eye: Eye,
  send: Send,
  plusCircle: AiOutlinePlusCircle,
  logIn: LogIn,
  arrowRightLeft: ArrowRightLeft,
  shield: Shield,
  loader: Loader,
  shieldAlert: ShieldAlert,
  checkCircle: AiOutlineCheckCircle,
  xCircle: XCircle,
  key: AiOutlineKey,
  refresh: RefreshCw,
  clock: Clock,
  settings: Settings,
  sun: Sun,
  moon: Moon,
  search: Search,
  gripVertical: GripVertical,
  panelLeft: PanelLeft,
  moreHorizontal: MoreHorizontal,
};

export type IconName = keyof typeof Icons;

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
}

export const Icon: React.FC<IconProps> = ({ name, size = 24, ...props }) => {
  const IconComponent = Icons[name];
  return <IconComponent size={size} {...props} />;
};
