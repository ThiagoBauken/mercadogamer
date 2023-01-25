interface CategroyCardProps extends ChildrenProps {
  type?: 'default';
  bgColor?: string;
  radius?: number;
  size?: 'normal';
  onClick?: (event?: MouseEvent) => void;
}
