interface TextareaProps extends ChildrenProps, WrapLabelProps {
  rows?: number;
  value?: string | number;
  placeholder?: string;
  bgColor?: string;
  inputRef?: RefCallBack;
  full?: boolean;
  onChange?: (value: string) => void;
  onKeyup?: (event: KeyboardEvent<HTMLInputElement>) => void;
}
