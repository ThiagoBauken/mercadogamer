interface RangeSliderProps {
  value?: number[];
  max?: number;
  min?: number;
  step?: number;
  disabled?: boolean;
  color?: string;
  onChange?: (value: number[]) => void;
  onFinalChange?: (value: number[]) => void;
}
