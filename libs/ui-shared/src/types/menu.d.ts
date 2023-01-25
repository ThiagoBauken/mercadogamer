type MenuPositionType = {
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
  width?: number;
};

interface MenuProps extends ChildrenProps {
  value?: string | number | boolean | any[];
  multiple?: boolean;
  activator: React.ReactNode;
  open?: boolean;
  full?: boolean;
  menuItems?: (string | MenuItemProps)[];
  disabled?: boolean;
  maxHeight?: number | string;
  inline?: boolean;
  contentClass?: string;
  borderColor?: DefaultColor | string;
  align?: 'auto' | 'left' | 'right';
  width?: number | string;
  renderItem?: (value: string | MenuItemProps) => React.ReactNode;
  onChange?: (value: string | number | boolean | string[] | number[]) => void;
  onChangeOpen?: (value?: boolean) => void;
}

type MenuItemProps = {
  icon?: string | React.ReactNode;
  label?: string | React.ReactNode;
  value?: string | number | boolean;
  color?: string;
  hide?: boolean;
  divition?: boolean;
  [key: string]: any;
  action?: (event?: React.MouseEvent) => void;
};
