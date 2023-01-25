interface RatingProps {
  className?: string;
  icon?: string;
  activeIcon?: string;
  iconSize?: number;
  rating?: number;
  maxRating?: number;
  activeColor?: string;
  deactiveColor?: string;
  editable?: boolean;
  // actions
  onChange?: (rate: number) => void;
}
