interface RadioboxProps extends WrapLabelProps {
  className?: string;
  checked?: boolean;
  color?: string;
  textColor?: string;
  size?: 'large' | 'default' | 'small';
  loading?: boolean;
  inputRef?: React.MutableRefObject;
  onChange?: (value: boolean) => void;
}
