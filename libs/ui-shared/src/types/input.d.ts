interface InputProps extends ChildrenProps, WrapLabelProps {
  type?: 'text' | 'number' | 'password';
  value?: string | number;
  placeholder?: string;
  prefix?: string;
  prefixNode?: string | React.ReactNode;
  endfix?: strig;
  endfixNode?: strig | React.ReactNode;
  bgColor?: string;
  inputRef?: RefCallBack;
  full?: boolean;
  hideSpin?: boolean;
  min?: number | string;
  onChange?: (value: string | number) => void;
  onKeyup?: (event: KeyboardEvent<HTMLInputElement>) => void;
  onPreFixClick?: () => void;
  onEndFixClick?: () => void;
}
