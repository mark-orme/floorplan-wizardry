
import { SliderProps } from '@radix-ui/react-slider';

declare module '@/components/ui/slider' {
  export interface SliderProps extends React.ComponentPropsWithoutRef<typeof Slider> {
    className?: string;
    min: number;
    max: number;
    step: number;
    value: number[];
    onValueChange: (values: number[]) => void;
  }
}
