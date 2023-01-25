interface SelectProps extends WrapLabelProps {
  value?: any;
  multiple?: boolean;
  full?: boolean;
  items?: (string | MenuItemProps)[];
  suggestion?: boolean;
  placeholder?: string;
  bgColor?: string;
  width?: number | string;
  miniSize?: boolean;
  inputRef?: RefCallBack;
  renderLabel?: (item: string | MenuItemProps) => React.ReactNode;
  renderItem?: (item: string | MenuItemProps) => React.ReactNode;
  onChange?: (value: any) => void;
}

interface MultipleSelect extends Omit<SelectProps, 'items'> {
  items: MenuItemProps[];
}
