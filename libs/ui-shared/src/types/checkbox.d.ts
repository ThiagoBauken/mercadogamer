interface CheckboxProps extends WrapLabelProps {
  className?: string;
  checked?: boolean;
  indeterminate?: boolean;
  color?: string;
  textColor?: string;
  size?: 'large' | 'default' | 'small';
  loading?: boolean;
  inputRef?: React.MutableRefObject;
  stopPropagation?: boolean;
  onChange?: (value: boolean) => void;
}
