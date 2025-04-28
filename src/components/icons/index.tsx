
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
  AiOutlinePalette,
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
  palette: AiOutlinePalette,
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
};

export type IconName = keyof typeof Icons;

// Convenience wrapper for icon components
export interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  ...props
}) => {
  const IconComponent = Icons[name];
  return <IconComponent size={size} {...props} />;
};
