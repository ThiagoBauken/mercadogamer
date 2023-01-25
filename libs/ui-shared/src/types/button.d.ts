import { MutableRefObject } from 'react';

interface ButtonProps extends ChildrenProps {
  kind?: 'primary' | 'secondary' | 'no-color' | 'round' | 'transparent';
  type?: 'button' | 'submit' | 'reset';
  textTransform?: 'unset' | 'capitalize' | 'lowercase' | 'uppercase';
  color?: string;
  bgColor?: string;
  radius?: number;
  size?: 'normal' | 'big';
  disabled?: boolean;
  width?: string | number;
  full?: boolean;
  roundIcon?: string;
  loading?: boolean;
  passedRef?: MutableRefObject;
  id?: string;
  onClick?: (event?: MouseEvent) => void;
}
