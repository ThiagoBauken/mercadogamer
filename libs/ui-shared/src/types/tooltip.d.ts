interface TooltipProps extends ChildrenProps {
  show?: boolean;
  tooltip?: string | React.ReactNode;
  bgColor?: string;
  borderColor?: DefaultColor | string;
  className?: string;
  move?: boolean;
  position?: TooltipPositionType;
  width?: number;
  onChangeShow?: (show: boolean) => void;
}

type TooltipPositionType = 'top' | 'left' | 'bottom' | 'right';
